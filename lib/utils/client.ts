'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/supabase/database.types';

// Create a singleton Supabase client to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export function getSupabaseClient() {
    if (supabaseInstance === null) {
        supabaseInstance = createClientComponentClient<Database>();
    }
    return supabaseInstance;
}