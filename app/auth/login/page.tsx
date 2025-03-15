// app/auth/login/page.tsx
import React from 'react';
import { Metadata } from 'next';
import LoginForm from '@/components/auth/login-form';

export const metadata: Metadata = {
    title: 'Login | NQESH Reviewer',
    description: 'Login to your NQESH Reviewer account',
};

export default function LoginPage(): React.ReactElement {
    return (
        <div className="container flex items-center justify-center min-h-screen py-10">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}