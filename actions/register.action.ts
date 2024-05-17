"use server"

import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/repository/user-repository"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export const handleRegister = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid credentials" }
    }

    const { name, email, password } = validateFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return { error: "User already exists" }
    }

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
    if (!user) return { error: "Somting went wrong!" }
    // TODO: send verification token email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, user?.name as string, verificationToken.token);
    return { success: "Confirmation Email sent!" }

}