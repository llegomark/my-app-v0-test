"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSupabase } from '@/providers/supabase-provider';

export default function ResultsPage(): React.ReactElement {
    const searchParams = useSearchParams();
    const { supabase, user } = useSupabase();

    const score = parseInt(searchParams.get('score') || '0');
    const totalQuestions = parseInt(searchParams.get('total') || '1');
    const categoryId = searchParams.get('category');

    const [category, setCategory] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Calculate percentage
    const percentage = Math.round((score / totalQuestions) * 100);

    // Get feedback based on score
    const getFeedback = (): string => {
        if (percentage >= 90) return "Excellent! You have a strong understanding of this topic.";
        if (percentage >= 75) return "Very good! You have a solid grasp of this topic.";
        if (percentage >= 60) return "Good job! You're on the right track, but there's room for improvement.";
        if (percentage >= 40) return "You've made a good start, but you should review this topic more thoroughly.";
        return "You need to spend more time studying this topic. Don't give up!";
    };

    // Fetch category details and user info
    useEffect(() => {
        async function fetchData(): Promise<void> {
            try {
                setLoading(true);
                // Check if we have a user
                if (!user) {
                    toast.error("Session expired. Please login again.");
                    return;
                }

                // Fetch the category
                if (categoryId) {
                    const { data, error } = await supabase
                        .from('categories')
                        .select('*')
                        .eq('id', categoryId)
                        .single();

                    if (error) {
                        console.error('Error fetching category:', error);
                        toast.error("Failed to load category data");
                    } else {
                        setCategory(data);
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error("Failed to load results data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [categoryId, supabase, user]);

    if (loading) {
        return <div className="text-center p-8">Loading results...</div>;
    }

    // If no user is found, show a message instead of redirecting
    if (!user) {
        return (
            <div className="container mx-auto py-12 max-w-3xl">
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Session Expired</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p>Your session has expired. Please login again to view your results.</p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button asChild>
                            <Link href="/auth/login">Login</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 max-w-3xl">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold">
                        Review Results
                    </CardTitle>
                    {category && (
                        <p className="text-lg text-muted-foreground">
                            {category.name}
                        </p>
                    )}
                </CardHeader>

                <CardContent className="space-y-8 p-8">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="text-5xl font-bold">
                            {score} / {totalQuestions}
                        </div>
                        <div className="text-xl font-medium">
                            {percentage}%
                        </div>
                        <div className="w-full max-w-md mt-4">
                            <Progress
                                value={percentage}
                                className="h-3"
                            />
                        </div>
                    </div>

                    <div className="bg-muted rounded-lg p-6 text-center">
                        <p className="text-lg font-medium">
                            {getFeedback()}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">What's Next?</h3>
                        <p>
                            {percentage >= 75 ? (
                                "You've done well on this category! Consider exploring other topics to broaden your knowledge or challenge yourself with more advanced questions."
                            ) : (
                                "To improve your score, review the explanations for the questions you got wrong. Consider retaking this quiz after studying the relevant materials."
                            )}
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-8">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        asChild
                    >
                        <Link href={`/reviewer/${categoryId}`}>
                            Retry This Category
                        </Link>
                    </Button>
                    <Button
                        className="w-full sm:w-auto"
                        asChild
                    >
                        <Link href="/dashboard">
                            Back to Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}