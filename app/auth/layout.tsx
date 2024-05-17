import React from 'react'

function AuthLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex w-full h-screen items-center justify-center bg-gradient-to-l from-sky-500 to-blue-800">

            {children
        }</div>
    )
}

export default AuthLayout