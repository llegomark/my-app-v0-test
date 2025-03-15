import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/database.types';

// Skip console logs when checking cookies
const originalConsoleError = console.error;
console.error = function (message, ...args) {
    if (typeof message === 'string' && message.includes('cookies()')) {
        return;
    }
    originalConsoleError(message, ...args);
};

export async function middleware(request: NextRequest) {
    try {
        const res = NextResponse.next();

        // Create a Supabase client for the middleware
        const supabase = createMiddlewareClient<Database>({
            req: request,
            res,
        });

        // Refresh the session
        await supabase.auth.getSession();

        return res;
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
    }
}

// Apply middleware to relevant routes
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - static assets
         */
        '/((?!_next/static|_next/image|favicon.ico|public/|static/).*)',
    ],
};