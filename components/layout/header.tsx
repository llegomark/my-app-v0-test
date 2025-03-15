// components/layout/header.tsx
"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Header(): React.ReactElement | null {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check if there's an authenticated user
        async function getUser(): Promise<void> {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error('Error getting user:', error);
            } finally {
                setLoading(false);
            }
        }

        getUser();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Handle logout
    async function handleLogout(): Promise<void> {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // Hide on auth pages
    if (pathname?.startsWith('/auth/')) {
        return null;
    }

    return (
        <header className="bg-background border-b py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div>
                    <Link href="/" className="text-2xl font-bold">
                        NQESH Reviewer
                    </Link>
                </div>

                <nav>
                    {!loading && (
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link href="/dashboard" className={`text-sm font-medium ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                                        Dashboard
                                    </Link>
                                    <Button variant="outline" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                        Login
                                    </Link>
                                    <Button asChild size="sm">
                                        <Link href="/auth/register">
                                            Register
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}