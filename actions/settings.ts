"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { getUserByEmail, getUserById } from "@/repository/user-repository"
import { SettingsSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from 'bcryptjs'
import { unstable_update } from "@/auth"

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser()
    if (!user) {
        return { error: "You must be logged in to update your settings." }
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "User not found." }
    }

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
        const userWithEmail = await getUserByEmail(values.email);
        if (userWithEmail && userWithEmail.id !== user.id) {
            return { error: "Email already in use." }
        }
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password)
        if (!passwordsMatch) {
            return { error: "Incorrect password." }
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    const verificationToken = await generateVerificationToken(values.email as string);
    if (verificationToken) {
        await sendVerificationEmail(
            verificationToken.email,
            values.name,
            verificationToken.token
        )
        return { success: "Verification email sent." }
    }

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: { ...values },
    })
    console.log('user updated name', updatedUser);

    // update user in next-auth
if(updatedUser){
    unstable_update({
        user:{
            name:updatedUser.name!,
            email:updatedUser.email,
            isTwoFactorEnabled:updatedUser.isTwoFactorEnabled,
            role:updatedUser.role,
        }
    })
}
    return { success: "Settings     updated!" };
}