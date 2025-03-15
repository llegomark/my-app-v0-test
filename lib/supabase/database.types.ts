// lib/supabase/database.types.ts
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            questions: {
                Row: {
                    id: string
                    category_id: string
                    question_text: string
                    option_a: string
                    option_b: string
                    option_c: string
                    option_d: string
                    correct_option: string
                    explanation: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    category_id: string
                    question_text: string
                    option_a: string
                    option_b: string
                    option_c: string
                    option_d: string
                    correct_option: string
                    explanation?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    category_id?: string
                    question_text?: string
                    option_a?: string
                    option_b?: string
                    option_c?: string
                    option_d?: string
                    correct_option?: string
                    explanation?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "questions_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            user_answers: {
                Row: {
                    id: string
                    user_id: string
                    question_id: string
                    selected_option: string | null
                    is_correct: boolean | null
                    time_taken: number | null
                    timed_out: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    question_id: string
                    selected_option?: string | null
                    is_correct?: boolean | null
                    time_taken?: number | null
                    timed_out?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    question_id?: string
                    selected_option?: string | null
                    is_correct?: boolean | null
                    time_taken?: number | null
                    timed_out?: boolean
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_answers_question_id_fkey"
                        columns: ["question_id"]
                        referencedRelation: "questions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_answers_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            user_progress: {
                Row: {
                    id: string
                    user_id: string
                    category_id: string
                    total_questions: number
                    correct_answers: number
                    completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    category_id: string
                    total_questions?: number
                    correct_answers?: number
                    completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category_id?: string
                    total_questions?: number
                    correct_answers?: number
                    completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_progress_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_progress_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            user_sessions: {
                Row: {
                    id: string
                    user_id: string
                    category_id: string
                    start_time: string
                    end_time: string | null
                    duration: number | null
                    completed: boolean
                }
                Insert: {
                    id?: string
                    user_id: string
                    category_id: string
                    start_time?: string
                    end_time?: string | null
                    duration?: number | null
                    completed?: boolean
                }
                Update: {
                    id?: string
                    user_id?: string
                    category_id?: string
                    start_time?: string
                    end_time?: string | null
                    duration?: number | null
                    completed?: boolean
                }
                Relationships: [
                    {
                        foreignKeyName: "user_sessions_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_sessions_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}