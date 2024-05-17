"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/repository/user-repository"
import { NewPasswordSchema } from "@/schemas"
import { getPasswordResetTokenByToken } from "@/repository/password-reset-token"

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string) => {
    const validateFields = NewPasswordSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid Password" }
    }

    const { password } = validateFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!token) {
        return { error: "Missing token" }
    }
    const existingToken = await getPasswordResetTokenByToken(token);
    
    if (!existingToken) {
        return { error: "Token not found" }
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: "Token has expired!" }
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: "User no exist" }
    }

    const userUpdated = await db.user.update({
        where: { id: existingUser.id },
        data: {
            email: existingUser.email,
            password: hashedPassword
        }
    })
    if (!userUpdated) return { error: "Somting went wrong!" }

    await db.passwordResetToken.delete({
        where: {
            token: token
        }
        });

    return { success: "Password updated!" }

}