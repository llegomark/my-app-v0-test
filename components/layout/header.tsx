"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/providers/supabase-provider';

export default function Header(): React.ReactElement | null {
    const pathname = usePathname();
    const { user, supabase } = useSupabase();

    // Handle logout
    async function handleLogout(): Promise<void> {
        try {
            await supabase.auth.signOut();
            window.location.href = '/';
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
                </nav>
            </div>
        </header>
    );
}