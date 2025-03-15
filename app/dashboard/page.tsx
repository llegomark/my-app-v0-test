// app/dashboard/page.tsx
import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import CategoryCard from '@/components/dashboard/category-card';
import { Category, UserProgress } from '@/types';

export default async function DashboardPage(): Promise<React.ReactElement> {
    // Create a server-side Supabase client
    const supabase = createServerSupabaseClient();

    // Check if user is authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (!session || authError) {
        redirect('/auth/login');
    }

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return <div>Error loading categories. Please try again later.</div>;
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
                {categories.map((category) => {
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
                        />
                    );
                })}
            </div>
        </div>
    );
}