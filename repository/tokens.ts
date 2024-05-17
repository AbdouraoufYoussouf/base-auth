import { getVerificationTokenByEmail } from '@/repository/verification-token';
import { v4 as uuid } from 'uuid'
import { db } from '../lib/db';

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