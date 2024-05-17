"use server"

import { signIn } from "@/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/repository/tokens";
import { getUserByEmail } from "@/repository/user-repository";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth";
import { z } from "zod"

export const handleLogin = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid credentials" }
    }

    const { email, password } = validateFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, existingUser.name as string, verificationToken.token)
        return { success: "Your compte does note verified, and Confirmation email sended, show in your box!" }
    }


    try {
        await signIn("credentials", {
            email: email,
            password: password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: "Invalid credentials" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }

}