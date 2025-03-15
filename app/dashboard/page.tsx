import React from 'react';
import { redirect } from 'next/navigation';
import CategoryCard from '@/components/dashboard/category-card';
import { Category, UserProgress } from '@/types';
import { requireAuth, getSupabaseServerClient } from '@/lib/utils/auth';

// Force dynamic rendering to ensure fresh auth state
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage(): Promise<React.ReactElement> {
    try {
        // Get the session and redirect if not logged in
        const session = await requireAuth();

        // Get a supabase client for server operations
        const supabase = await getSupabaseServerClient();

        // Fetch categories
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (categoriesError) {
            console.error('Error fetching categories:', categoriesError);
            return <div className="p-8 text-center">Error loading categories. Please try again later.</div>;
        }

        // Fetch user progress for all categories
        const { data: userProgress, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', session.user.id);

        if (progressError) {
            console.error('Error fetching user progress:', progressError);
        }

        // Create a map of category progress
        const progressMap: Record<string, UserProgress> = {};
        if (userProgress) {
            userProgress.forEach(progress => {
                progressMap[progress.category_id] = progress as UserProgress;
            });
        }

        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Select a Category</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories?.map((category) => {
                        const progress = progressMap[category.id] || {
                            id: '',
                            user_id: session.user.id,
                            category_id: category.id,
                            total_questions: 0,
                            correct_answers: 0,
                            completed: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        };

                        return (
                            <CategoryCard
                                key={category.id}
                                category={category as Category}
                                progress={progress}
                                userId={session.user.id}
                            />
                        );
                    })}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Dashboard error:', error);
        redirect('/auth/login');
    }
}