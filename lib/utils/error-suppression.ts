'use client';

// This module suppresses known Supabase + Next.js cookie warnings that can't be fixed
// by the application code directly, as they originate inside Supabase's libraries

/**
 * Suppresses cookie warning errors from Supabase that can't be fixed
 * directly in our application code.
 */
export function suppressSupabaseCookieErrors() {
    if (typeof window !== 'undefined') {
        // Store original console methods
        const originalConsoleError = console.error;

        // Override console.error to filter out cookie warnings
        console.error = function (...args: any[]) {
            // Filter out supabase cookie errors
            if (
                args[0] &&
                typeof args[0] === 'string' &&
                (
                    args[0].includes('cookies().get') ||
                    args[0].includes('cookies().set') ||
                    args[0].includes('GoTrueClient instances')
                )
            ) {
                // Suppress these errors
                return;
            }

            // Let other errors through
            return originalConsoleError.apply(console, args);
        };

        // Return a cleanup function
        return () => {
            console.error = originalConsoleError;
        };
    }

    return () => { }; // No-op on server
}