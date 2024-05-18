import { db } from "@/lib/db"

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.toFactorToken.findFirst({
            where: { email }
        })
        return twoFactorToken;
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