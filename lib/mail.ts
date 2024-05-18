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
    console.log('Email verification send!')
}

export const sendPasswordResetEmail = async (
    email: string,
    name: string,
    token: string
) => {
    const resetLink = `${process.env.ORIGIN_URL}/auth/new-password?token=${token}`
    const message = `<p> Hi ${name}, <br> Please click here to reset your password. <br> 
    <a href="${resetLink}">Verify Email</a></p>`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset password",
        html: message,
    })
    console.log('Email reset send!')
}

export const sendTwoFactorTokenEmail = async (
    email: string,
    name: string,
    token: string
) => {
    const message = `<p> Hi ${name}, <br> Your 2FA code: ${token}</a></p>`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: message,
    })
    console.log('Email reset send!')
}