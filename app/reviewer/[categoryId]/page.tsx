import React from 'react';
import { redirect } from 'next/navigation';
import ReviewerContainer from '@/components/reviewer/reviewer-container';
import { Question } from '@/types';
import { requireAuth, getSupabaseServerClient } from '@/lib/utils/auth';

// Force dynamic rendering to ensure fresh auth state
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ReviewerPageProps {
    params: {
        categoryId: string;
    };
}

export default async function ReviewerPage({ params }: ReviewerPageProps): Promise<React.ReactElement> {
    // Properly await the params
    const categoryId = await Promise.resolve(params.categoryId);

    try {
        // Get the session and redirect if not logged in
        const session = await requireAuth();

        // Get a supabase client for server operations
        const supabase = await getSupabaseServerClient();

        // Fetch the category
        const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single();

        if (categoryError || !category) {
            console.error('Error fetching category:', categoryError);
            redirect('/dashboard');
        }

        // Fetch questions for this category
        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('*')
            .eq('category_id', categoryId)
            .order('created_at');

        if (questionsError) {
            console.error('Error fetching questions:', questionsError);
            return <div className="p-8 text-center">Error loading questions. Please try again later.</div>;
        }

        // Check if there are questions
        if (!questions || questions.length === 0) {
            return (
                <div className="container mx-auto py-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        No questions available for this category yet. Please check back later.
                    </p>
                    <a
                        href="/dashboard"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Back to Dashboard
                    </a>
                </div>
            );
        }

        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">{category.name} Reviewer</h1>
                <ReviewerContainer
                    categoryId={categoryId}
                    initialQuestions={questions as Question[]}
                    userId={session.user.id}
                />
            </div>
        );
    } catch (error) {
        console.error('Reviewer page error:', error);
        redirect('/auth/login');
    }
}