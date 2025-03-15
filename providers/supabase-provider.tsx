'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/database.types';
import type { User, Session } from '@supabase/supabase-js';
import { suppressSupabaseCookieErrors } from '@/lib/utils/error-suppression';

type SupabaseContext = {
    supabase: SupabaseClient<Database>;
    user: User | null;
    session: Session | null;
    isLoading: boolean;
};

// Create the context
const Context = createContext<SupabaseContext | undefined>(undefined);

// Provider component that wraps the app and makes Supabase available to any child component
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    // Create a single supabase client for the entire application
    const [supabaseClient] = useState(() => createClientComponentClient<Database>());
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Suppress Supabase cookie errors
    useEffect(() => {
        return suppressSupabaseCookieErrors();
    }, []);

    useEffect(() => {
        // Get the current session and user
        const setupSupabase = async () => {
            try {
                const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
                setSession(currentSession);
                setUser(currentSession?.user || null);

                // Set up the auth state change listener
                const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
                    (_event, newSession) => {
                        setSession(newSession);
                        setUser(newSession?.user || null);

                        // Force refresh to update the navigation UI
                        if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
                            router.refresh();
                        }
                    }
                );

                return () => {
                    subscription.unsubscribe();
                };
            } catch (error) {
                console.error('Error setting up Supabase session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        setupSupabase();
    }, [supabaseClient, router]);

    return (
        <Context.Provider value={{ supabase: supabaseClient, user, session, isLoading }}>
            {children}
        </Context.Provider>
    );
}

// Hook to use the Supabase context
export function useSupabase() {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
}