import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Enter mail id or username"),
  password: z.string().min(1, "Enter password"),
  hipaaChecked: z.literal(true, {
    message: "You must agree to the HIPAA Compliance Agreement."
  }),
});

// ── Strong password policy for sign-up (HIPAA Technical Safeguard) ──
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter (A–Z)")
  .regex(/[0-9]/, "Must contain at least one number (0–9)")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character (!@#$% etc.)");

export const signUpSchema = z.object({
  firstName: z.string().min(1, "Enter first name"),
  lastName: z.string().min(1, "Enter last name"),
  email: z.string().min(1, "Enter mail id").email("Invalid email address"),
  password: passwordSchema,
  hipaaChecked: z.literal(true, {
    message: "You must agree to the HIPAA Compliance Agreement."
  }),
});
