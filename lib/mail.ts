import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email: string,
    name: string,
    token: string
) => {
    const confirmLink = `${process.env.ORIGIN_URL}/auth/new-verification?token=${token}`
    const message = `<p> Hi ${name}, <br> Please click on the link below to verify your email address. <br> 
    <a href="${confirmLink}">Verify Email</a></p>`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email address",
        html: message,
    })
    console.log('Email send!')
}