'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Database } from '@/lib/supabase/database.types';

export async function getSession() {
    const cookieStore = cookies();
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore });

    return await supabase.auth.getSession();
}

export async function signOut() {
    const cookieStore = cookies();
    const supabase = createServerActionClient<Database>({ cookies: () => cookieStore });

    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/');
}

export async function checkSessionAndRedirectIfNeeded() {
    const { data: { session } } = await getSession();

    if (!session) {
        redirect('/auth/login');
    }

    return session;
}