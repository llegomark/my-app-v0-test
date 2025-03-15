// lib/supabase/server-client.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './database.types';
import { cache } from 'react';

// Use React cache to prevent excessive client creation
export const createServerSupabaseClient = cache(async () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
});