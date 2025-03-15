'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/supabase/database.types';

// Define the function as async to satisfy Server Actions requirement
export async function getSupabaseServerClient() {
    const cookieStore = cookies();
    return createServerActionClient<Database>({
        cookies: () => cookieStore
    });
}

// Safely check session
export async function getServerSession() {
    try {
        const supabase = await getSupabaseServerClient();

        // Await the session data correctly
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error getting session:', error);
            return { session: null };
        }

        return { session: data.session };
    } catch (error) {
        console.error('Error getting session:', error);
        return { session: null };
    }
}

// Protected route wrapper
export async function requireAuth() {
    const { session } = await getServerSession();

    if (!session) {
        redirect('/auth/login');
    }

    return session;
}

// Sign out action
export async function signOut() {
    try {
        const supabase = await getSupabaseServerClient();
        await supabase.auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
    }

    redirect('/');
}