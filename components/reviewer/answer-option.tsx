// components/reviewer/answer-option.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { AnswerOptionProps } from '@/types/component-types';

export default function AnswerOption({
    label,
    text,
    isSelected,
    isCorrect,
    isRevealed,
    onSelect
}: AnswerOptionProps): React.ReactElement {
    // Determine the styling based on state
    const getOptionClasses = (): string => {
        const baseClasses = "flex items-start p-4 rounded-md border cursor-pointer transition";

        if (!isRevealed) {
            return cn(
                baseClasses,
                isSelected
                    ? "border-primary bg-primary/10 border-2"
                    : "border-muted-foreground/20 hover:border-primary hover:bg-primary/5"
            );
        }

        if (isCorrect) {
            return cn(
                baseClasses,
                "border-green-500 bg-green-50 border-2"
            );
        }

        if (isSelected && !isCorrect) {
            return cn(
                baseClasses,
                "border-red-500 bg-red-50 border-2"
            );
        }

        return cn(
            baseClasses,
            "border-muted-foreground/20 opacity-70"
        );
    };

    return (
        <div
            className={getOptionClasses()}
            onClick={() => !isRevealed && onSelect()}
        >
            <div
                className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full mr-3 text-sm font-bold",
                    isRevealed && isCorrect
                        ? "bg-green-500 text-white"
                        : isRevealed && isSelected && !isCorrect
                            ? "bg-red-500 text-white"
                            : isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                )}
            >
                {label}
            </div>
            <div className="flex-1">
                {text}
            </div>
        </div>
    );
}