// lib/validators/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters long' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// lib/validators/reviewer.ts
export const userAnswerSchema = z.object({
  userId: z.string().uuid(),
  questionId: z.string().uuid(),
  selectedOption: z.string(),
  isCorrect: z.boolean(),
  timeTaken: z.number().int().positive(),
  timedOut: z.boolean().default(false),
});

export type UserAnswerData = z.infer<typeof userAnswerSchema>;

export const userSessionSchema = z.object({
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date().optional(),
  duration: z.number().int().optional(),
  completed: z.boolean().default(false),
});

export type UserSessionData = z.infer<typeof userSessionSchema>;