import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  role: z.enum(["buyer", "manufacturer", "admin"]),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  agreed_to_terms: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token_type: string;
    access_token: string;
    user: User;
  };
}
