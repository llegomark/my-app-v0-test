// app/auth/register/page.tsx
import React from 'react';
import { Metadata } from 'next';
import RegisterForm from '@/components/auth/register-form';

export const metadata: Metadata = {
    title: 'Register | NQESH Reviewer',
    description: 'Create a new NQESH Reviewer account',
};

export default function RegisterPage(): React.ReactElement {
    return (
        <div className="container flex items-center justify-center min-h-screen py-10">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </div>
    );
}