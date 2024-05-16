import { emit } from 'process'
import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {
        message: 'Password must be at least 1 character'
    })
})



export const RegisterSchema = z.object({
    name: z.string().min(3, {
        message: 'Name must be at least 3 characters'
    }),
    email: z.string()
        .email("Email adress is not valide")
        .min(1, "Email is required"),
    password: z.string()
        .min(6, "Minimum password 6 caracteres")
        .max(50, "Maximum caracteres password 50"),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match'
    });