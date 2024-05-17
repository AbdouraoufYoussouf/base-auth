"use server"

import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { getUserByEmail } from "@/repository/user-repository";
import { ResetSchema } from "@/schemas"
import { z } from "zod"

export const reset = async (values:z.infer<typeof ResetSchema>)=>{
    const validatedFields = ResetSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:"Invalid email!"};
    }

    const {email} = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if(!existingUser){
        return {error:"Email not found!"};
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        existingUser.name as string, passwordResetToken.token
    )

return {success:"Reset email sent!"};
}