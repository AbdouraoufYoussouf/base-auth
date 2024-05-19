"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

interface LoginButtonProps {
    children: React.ReactNode
    mode?: "modal" | "redirect"
    asChild?: boolean
}
export const LoginButton: React.FC<LoginButtonProps> = ({ children, mode = 'redirect', asChild }) => {
    const router = useRouter()

    const onClick = () => {
        if (mode === 'redirect') {
            router.push('auth/login')
        }
    }

    if (mode === 'modal') {
        return (
            <span className='cursor-pointer'>Todo: implement modal</span>
        )
    }
    return (
        <span onClick={onClick} className='cursor-pointer'>{children}</span>
    )
}
