"use server"

import { db } from "@/lib/db";
import { getUserByEmail } from "@/repository/user-repository";
import { getVerificationTokenByToken } from "@/repository/verification-token"

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
    // console.log('token:', existingToken)
    if (!existingToken) {
        return { error: "Token does not exist!" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: "Token has expired!" }
    }

    const existingUser = await getUserByEmail(existingToken.email);
    console.log('user:', existingUser)
    if (!existingUser) {
        return { error: "User does not exist!" }
    }

    if (existingUser.emailVerified) {
        return { success: "Email  verifed!" }
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date(), email: existingToken.email }
    })

    return { success: "Email verifed!" };
}

export const deleteVerificationToken = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
        return { error: "Token does not exist!" }
    }

    await db.verificationToken.delete({
        where: { id: existingToken.id }
    })

    console.log("token deleted!");
    return { success: "Email verifed delete!" };
}
