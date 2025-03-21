import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/lib/supabase/database.types';

// This is important to prevent the route from being cached
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const requestUrl = new URL(request.url);
        const code = requestUrl.searchParams.get('code');

        if (code) {
            const cookieStore = cookies();
            const supabase = createRouteHandlerClient<Database>({
                cookies: () => cookieStore
            });

            await supabase.auth.exchangeCodeForSession(code);
        }

        // URL to redirect to after sign in process completes
        return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=callback', request.url));
    }
}