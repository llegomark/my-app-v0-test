// types/component-types.ts
import { ReactNode } from 'react';
import { Category, Question, UserProgress, OptionKey } from './index';

// Common component prop types
export interface LayoutProps {
    children: ReactNode;
}

export interface CategoryCardProps {
    category: Category;
    progress: UserProgress;
}

export interface ReviewerContainerProps {
    categoryId: string;
    initialQuestions: Question[];
    userId: string;
}

export interface QuestionTimerProps {
    duration: number;
    isActive: boolean;
    onTimeout: () => void;
}

export interface AnswerOptionProps {
    label: OptionKey;
    text: string;
    isSelected: boolean;
    isCorrect: boolean;
    isRevealed: boolean;
    onSelect: () => void;
}

export interface ExplanationProps {
    explanation: string;
    correctOption: OptionKey;
    selectedOption: OptionKey | null;
    timedOut: boolean;
}