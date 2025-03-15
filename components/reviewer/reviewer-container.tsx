// components/reviewer/reviewer-container.tsx
"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QuestionTimer from './question-timer';
import AnswerOption from './answer-option';
import Explanation from './explanation';
import { supabase } from '@/lib/supabase/client';
import { ReviewerContainerProps } from '@/types/component-types';
import { OptionKey } from '@/types';
import { toast } from 'sonner';

export default function ReviewerContainer({
    categoryId,
    initialQuestions,
    userId
}: ReviewerContainerProps): React.ReactElement {
    const router = useRouter();
    const [questions] = useState(initialQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);
    const [timedOut, setTimedOut] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    // Initialize session when component mounts
    useEffect(() => {
        async function initSession(): Promise<void> {
            try {
                // Create or get the latest session
                const { data, error } = await supabase
                    .from('user_sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('category_id', categoryId)
                    .eq('completed', false)
                    .order('start_time', { ascending: false })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching session:', error);
                    toast.error("Failed to initialize session");
                    return;
                }

                if (data) {
                    setSessionId(data.id);
                    setStartTime(new Date(data.start_time));
                } else {
                    // Create a new session
                    const now = new Date();
                    const { data: newSession, error: createError } = await supabase
                        .from('user_sessions')
                        .insert({
                            user_id: userId,
                            category_id: categoryId,
                            start_time: now.toISOString(),
                            completed: false
                        })
                        .select()
                        .single();

                    if (createError) {
                        console.error('Error creating session:', createError);
                        toast.error("Failed to create a new session");
                        return;
                    }

                    setSessionId(newSession.id);
                    setStartTime(now);
                }
            } catch (error) {
                console.error('Error initializing session:', error);
                toast.error("An error occurred while setting up the session");
            }
        }

        initSession();
    }, [userId, categoryId]);

    // Reset state when moving to next question
    useEffect(() => {
        setSelectedOption(null);
        setIsAnswered(false);
        setTimedOut(false);
        setStartTime(new Date());
        setEndTime(null);
    }, [currentQuestionIndex]);

    // Handle option selection
    async function handleOptionSelect(option: OptionKey): Promise<void> {
        if (isAnswered || timedOut) return;

        const now = new Date();
        setEndTime(now);
        setSelectedOption(option);
        setIsAnswered(true);

        const isCorrect = option === currentQuestion.correct_option;
        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }

        // Calculate time taken in seconds
        const timeTaken = Math.round(((now.getTime() - (startTime?.getTime() || now.getTime())) / 1000));

        // Record the answer in the database
        try {
            await supabase
                .from('user_answers')
                .insert({
                    user_id: userId,
                    question_id: currentQuestion.id,
                    selected_option: option,
                    is_correct: isCorrect,
                    time_taken: timeTaken,
                    timed_out: false
                });

            // Update user progress
            const { data: existingProgress, error: fetchError } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('category_id', categoryId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error fetching progress:', fetchError);
                toast.error("Failed to fetch progress data");
            }

            if (existingProgress) {
                // Update existing progress
                await supabase
                    .from('user_progress')
                    .update({
                        total_questions: existingProgress.total_questions + 1,
                        correct_answers: existingProgress.correct_answers + (isCorrect ? 1 : 0),
                        updated_at: now.toISOString()
                    })
                    .eq('id', existingProgress.id);
            } else {
                // Create new progress
                await supabase
                    .from('user_progress')
                    .insert({
                        user_id: userId,
                        category_id: categoryId,
                        total_questions: 1,
                        correct_answers: isCorrect ? 1 : 0,
                        completed: false
                    });
            }
        } catch (error) {
            console.error('Error recording answer:', error);
            toast.error("Failed to save your answer");
        }
    }

    // Handle timer timeout
    async function handleTimeout(): Promise<void> {
        if (isAnswered) return;

        const now = new Date();
        setEndTime(now);
        setTimedOut(true);
        toast.info("Time's up!", { description: "You ran out of time for this question." });

        // Calculate time taken - full 2 minutes (120 seconds)
        const timeTaken = 120;

        try {
            // Record the timed out answer
            await supabase
                .from('user_answers')
                .insert({
                    user_id: userId,
                    question_id: currentQuestion.id,
                    selected_option: null,
                    is_correct: false,
                    time_taken: timeTaken,
                    timed_out: true
                });

            // Update user progress
            const { data: existingProgress, error: fetchError } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('category_id', categoryId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error fetching progress:', fetchError);
            }

            if (existingProgress) {
                // Update existing progress
                await supabase
                    .from('user_progress')
                    .update({
                        total_questions: existingProgress.total_questions + 1,
                        updated_at: now.toISOString()
                    })
                    .eq('id', existingProgress.id);
            } else {
                // Create new progress
                await supabase
                    .from('user_progress')
                    .insert({
                        user_id: userId,
                        category_id: categoryId,
                        total_questions: 1,
                        correct_answers: 0,
                        completed: false
                    });
            }
        } catch (error) {
            console.error('Error recording timeout:', error);
            toast.error("Failed to record timeout");
        }
    }

    // Handle moving to next question or finishing
    async function handleNextQuestion(): Promise<void> {
        if (isLastQuestion) {
            try {
                // Update session as completed
                if (sessionId) {
                    const now = new Date();
                    const duration = Math.round(((now.getTime() - (startTime?.getTime() || now.getTime())) / 1000));

                    await supabase
                        .from('user_sessions')
                        .update({
                            end_time: now.toISOString(),
                            duration: duration,
                            completed: true
                        })
                        .eq('id', sessionId);

                    // Mark category as completed in user_progress
                    await supabase
                        .from('user_progress')
                        .update({
                            completed: true,
                            updated_at: now.toISOString()
                        })
                        .eq('user_id', userId)
                        .eq('category_id', categoryId);
                }

                toast.success("Review completed!");

                // Navigate to results page with score
                router.push(`/reviewer/results?score=${score}&total=${totalQuestions}&category=${categoryId}`);
            } catch (error) {
                console.error('Error finishing reviewer:', error);
                toast.error("Failed to save your results");
            }
        } else {
            // Move to next question
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="text-lg font-medium">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </div>

                <QuestionTimer
                    duration={120}
                    isActive={!isAnswered && !timedOut}
                    onTimeout={handleTimeout}
                />
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="text-xl font-semibold mb-6">
                        {currentQuestion.question_text}
                    </div>

                    <div className="space-y-4">
                        <AnswerOption
                            label="A"
                            text={currentQuestion.option_a}
                            isSelected={selectedOption === 'A'}
                            isCorrect={currentQuestion.correct_option === 'A'}
                            isRevealed={isAnswered || timedOut}
                            onSelect={() => handleOptionSelect('A')}
                        />

                        <AnswerOption
                            label="B"
                            text={currentQuestion.option_b}
                            isSelected={selectedOption === 'B'}
                            isCorrect={currentQuestion.correct_option === 'B'}
                            isRevealed={isAnswered || timedOut}
                            onSelect={() => handleOptionSelect('B')}
                        />

                        <AnswerOption
                            label="C"
                            text={currentQuestion.option_c}
                            isSelected={selectedOption === 'C'}
                            isCorrect={currentQuestion.correct_option === 'C'}
                            isRevealed={isAnswered || timedOut}
                            onSelect={() => handleOptionSelect('C')}
                        />

                        <AnswerOption
                            label="D"
                            text={currentQuestion.option_d}
                            isSelected={selectedOption === 'D'}
                            isCorrect={currentQuestion.correct_option === 'D'}
                            isRevealed={isAnswered || timedOut}
                            onSelect={() => handleOptionSelect('D')}
                        />
                    </div>

                    {(isAnswered || timedOut) && (
                        <Explanation
                            explanation={currentQuestion.explanation}
                            correctOption={currentQuestion.correct_option}
                            selectedOption={selectedOption}
                            timedOut={timedOut}
                        />
                    )}
                </CardContent>
            </Card>

            {(isAnswered || timedOut) && (
                <div className="flex justify-end">
                    <Button onClick={handleNextQuestion}>
                        {isLastQuestion ? "See Results" : "Next Question"}
                    </Button>
                </div>
            )}
        </div>
    );
}