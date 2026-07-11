import {z} from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});


export const LoginSchema = z.object({
    identifier: z.string().min(3, "Identifier must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// types for the schemas 
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

