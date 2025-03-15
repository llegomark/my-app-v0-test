// app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          NQESH Reviewer
        </h1>
        <p className="text-lg text-muted-foreground">
          Prepare for the National Qualifying Examination for School Heads (NQESH) with our comprehensive reviewer application. Practice questions, track your progress, and improve your chances of success.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
        <div className="mt-12 p-6 bg-card rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21H7a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2h10z"></path>
                  <path d="M17 3v18h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
                  <path d="M8 10h6"></path>
                  <path d="M8 14h6"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Comprehensive Question Bank</h3>
                <p className="text-sm text-muted-foreground">Access a wide range of question categories covering all NQESH subjects</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor your performance and identify areas for improvement</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Timed Practice</h3>
                <p className="text-sm text-muted-foreground">Test your knowledge under exam conditions with timed questions</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h5"></path>
                  <path d="M9 12h5"></path>
                  <path d="M16 12h6"></path>
                  <path d="M11.25 7L8 12l3.25 5"></path>
                  <path d="M18.25 7L15 12l3.25 5"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Detailed Explanations</h3>
                <p className="text-sm text-muted-foreground">Learn from comprehensive explanations for each question</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}