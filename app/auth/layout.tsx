// app/auth/layout.tsx
import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): React.ReactElement {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex items-center justify-center h-16 px-4 border-b">
                <Link href="/" className="text-2xl font-bold">
                    NQESH Reviewer
                </Link>
            </div>
            <main className="flex-1 flex items-center justify-center">
                {children}
            </main>
            <div className="py-6 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} NQESH Reviewer
            </div>
        </div>
    );
}