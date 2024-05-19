import React from 'react'
import { Navbar } from './_components/navbar'

interface ProtectedLayoutProps {
    children: React.ReactNode
}
const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div className="flex w-full flex-col gap-y-6 py-4 min-h-screen items-center justify-center bg-gradient-to-l from-sky-500 to-blue-800">
            <Navbar />
            <div>
                {children}
            </div>
        </div>
    )
}

export default ProtectedLayout