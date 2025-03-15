// components/layout/footer.tsx
import React from 'react';

export default function Footer(): React.ReactElement {
    return (
        <footer className="bg-background border-t py-6">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                    NQESH Reviewer © {new Date().getFullYear()} - A comprehensive reviewer application for the National Qualifying Examination for School Heads
                </p>
            </div>
        </footer>
    );
}