"use client";

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSupabase } from '@/providers/supabase-provider';
import { toast } from 'sonner';

interface CategoryCardProps {
    category: {
        id: string;
        name: string;
        description: string;
    };
    progress: {
        total_questions: number;
        correct_answers: number;
        completed: boolean;
    };
    userId: string;
}

export default function CategoryCard({ category, progress, userId }: CategoryCardProps): React.ReactElement {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { supabase } = useSupabase();

    // Calculate progress percentage
    const progressPercentage = progress.total_questions > 0
        ? Math.round((progress.correct_answers / progress.total_questions) * 100)
        : 0;

    async function startReviewer(): Promise<void> {
        setIsLoading(true);
        try {
            // Start a new session
            const { error } = await supabase
                .from('user_sessions')
                .insert({
                    user_id: userId,
                    category_id: category.id,
                    start_time: new Date().toISOString(),
                    completed: false
                });

            if (error) {
                throw error;
            }

            // Navigate to the reviewer page
            router.push(`/reviewer/${category.id}`);
        } catch (error) {
            console.error('Error starting reviewer:', error);
            toast.error("Failed to start the reviewer");
            setIsLoading(false);
        }
    }

    return (
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} />
                    </div>

                    {progress.completed && (
                        <div className="text-sm text-green-600 font-medium">
                            Completed: {progress.correct_answers}/{progress.total_questions} correct
                        </div>
                    )}

                    {!progress.completed && progress.total_questions > 0 && (
                        <div className="text-sm text-amber-600 font-medium">
                            In Progress: {progress.correct_answers}/{progress.total_questions} correct
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={startReviewer}
                    disabled={isLoading}
                >
                    {isLoading ? "Starting..." : progress.total_questions > 0 ? "Continue" : "Start"}
                </Button>
            </CardFooter>
        </Card>
    );
}