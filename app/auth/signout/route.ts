import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/lib/supabase/database.types';

// This is important to prevent the route from being cached
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient<Database>({
            cookies: () => cookieStore
        });

        await supabase.auth.signOut();

        return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
        console.error('Sign out error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}