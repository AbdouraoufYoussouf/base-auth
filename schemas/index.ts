import { UserRole } from '@prisma/client';
import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {
        message: 'Password must be at least 1 character'
    }),
    code: z.optional(z.string())
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required!"
    })
})

export const NewPasswordSchema = z.object({
    password: z.string()
        .min(6, "Minimum password 6 caracteres")
        .max(50, "Maximum caracteres password 50"),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match'
    });

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

export const SettingsSchema = z.object({
    name: z.string().min(3, {
        message: 'Name must be at least 3 characters'
    }),
    isTwoFactorEnabled:z.optional(z.boolean()),
    role:z.enum([UserRole.ADMIN,UserRole.USER]),
    email: z.optional(z.string().email()),
    password:z.optional(z.string().min(6)),
    newPassword:z.optional(z.string().min(6)),

}).refine((data)=>{
    if(data.password && !data.newPassword){
        return false;
    }
    return true;
},{
    path: ['newPassword'],
    message: 'new password is required'
}).refine((data)=>{
    if(data.newPassword && !data.password){
        return false;
    }
    return true;
},{
    path: ['password'],
    message: 'password is required'
});