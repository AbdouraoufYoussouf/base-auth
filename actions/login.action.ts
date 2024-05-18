"use server"

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/repository/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/repository/two-factor-token-confirmation";
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

    const { email, password, code } = validateFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, existingUser.name as string, verificationToken.token)
        return { success: "Your compte does note verified, and Confirmation email sended, show in your box!" }
    }

    // ajout de login twofactor
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if (!twoFactorToken) {
                return { error: "Invalid code!" }
            }
            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Invalid expered!" }
            }

            await db.toFactorToken.delete({
                where: { id: twoFactorToken.id }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                })
            }
            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            })
        } else {

            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, existingUser.name!, twoFactorToken.token);
            return { twoFactor: true };
        }
    }
    // end twofactor
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