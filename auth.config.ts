import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./repository/user-repository";
import bcrypt from "bcryptjs"
import { db } from "./lib/db";

const googleId = process.env.GOOGLE_CLIENT_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET

const githubId = process.env.GITHUB_CLIENT_ID
const githubSecret = process.env.GITHUB_CLIENT_SECRET

console.log(googleId)

// if (!googleId || !googleSecret) {
//     throw new Error('Google id or secret not found');
// }

// if (!githubId || !githubSecret) {
//     throw new Error('github id or secret not found');
// }


export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Github({
            clientId: githubId,
            clientSecret: githubSecret,
        }),
        Credentials({
            async authorize(credentials) {
                const validateFields = LoginSchema.safeParse(credentials);

                if (validateFields.success) {
                    const { email, password } = validateFields.data;

                    // const user = await getUserByEmail(email);
                    const user = await db.user.findUnique({ where: { email } })
                    if (!user || !user.password) return null;

                    const passwordMatch = await bcrypt.compare(password, user.password)

                    if (passwordMatch) {
                        return user;
                    }
                }
                return null;
            }
        })
    ],
} satisfies NextAuthConfig