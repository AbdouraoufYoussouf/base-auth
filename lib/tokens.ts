import { getVerificationTokenByEmail } from '@/repository/verification-token';
import { getPasswordResetTokenByEmail } from '@/repository/password-reset-token';
import { v4 as uuid } from 'uuid'
import { db } from './db';

export const generateVerificationToken = async (email: string) => {
    const token = uuid()
    // expire dans une heure
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: { token, expires, email }
    })
    console.log('token created')
    return verificationToken;
}


export const generatePasswordResetToken = async (email: string) => {
    const token = uuid()
    // expire dans une heure
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: { token, expires, email }
    })
    console.log('token created')
    return passwordResetToken;
}

