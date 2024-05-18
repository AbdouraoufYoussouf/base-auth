import { db } from "@/lib/db"

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: { userId }
        })
        return twoFactorConfirmation;
    } catch (error) {
        return null
    }
}


export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.toFactorToken.findUnique({
            where: { token }
        })
        return twoFactorToken;
    } catch (error) {
        return null
    }
}