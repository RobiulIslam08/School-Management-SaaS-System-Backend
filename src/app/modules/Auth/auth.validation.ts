import { z } from "zod";

export const loginValidation = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const twoFactorValidation = z.object({
  tempToken: z.string().min(1, "Two-factor session is missing"),
  code: z.string().min(6, "Authenticator code must be at least 6 digits"),
});

export const forgotPasswordValidation = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordValidation = z.object({
  email: z.string().email("Enter a valid email address"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Reset code must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
