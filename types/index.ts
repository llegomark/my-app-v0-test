// types/index.ts
export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export interface Question {
    id: string;
    category_id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: 'A' | 'B' | 'C' | 'D';
    explanation: string;
    created_at: string;
}

export interface UserProgress {
    id: string;
    user_id: string;
    category_id: string;
    total_questions: number;
    correct_answers: number;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserAnswer {
    id?: string;
    user_id: string;
    question_id: string;
    selected_option: 'A' | 'B' | 'C' | 'D' | null;
    is_correct: boolean;
    time_taken: number;
    timed_out: boolean;
    created_at?: string;
}

export interface UserSession {
    id?: string;
    user_id: string;
    category_id: string;
    start_time: string;
    end_time?: string;
    duration?: number;
    completed: boolean;
}

export type OptionKey = 'A' | 'B' | 'C' | 'D';