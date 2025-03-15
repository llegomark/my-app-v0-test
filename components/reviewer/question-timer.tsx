// components/reviewer/question-timer.tsx
"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { QuestionTimerProps } from '@/types/component-types';

export default function QuestionTimer({
    duration,
    isActive,
    onTimeout
}: QuestionTimerProps): React.ReactElement {
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const progressPercentage = (timeLeft / duration) * 100;

    // Determine color based on time left
    const getTimerColor = (): string => {
        if (timeLeft > duration * 0.6) return 'text-green-600';
        if (timeLeft > duration * 0.3) return 'text-amber-600';
        return 'text-red-600';
    };

    useEffect(() => {
        setTimeLeft(duration);
        setIsRunning(isActive);
    }, [duration, isActive]);

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;

        if (isRunning && timeLeft > 0) {
            timerId = setTimeout(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            onTimeout();
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [timeLeft, isRunning, onTimeout]);

    return (
        <div className="w-48">
            <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">Time Remaining</div>
                <div className={`text-sm font-bold ${getTimerColor()}`}>
                    {formatTime(timeLeft)}
                </div>
            </div>
            <Progress
                value={progressPercentage}
                className={`h-2 ${timeLeft > duration * 0.6
                        ? 'bg-green-600'
                        : timeLeft > duration * 0.3
                            ? 'bg-amber-600'
                            : 'bg-red-600'
                    }`}
            />
        </div>
    );
}