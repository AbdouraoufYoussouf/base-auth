import BackButton from '@/components/auth/back-button'
import CardWrapper from '@/components/auth/card-wrapper'
import HeaderAuth from '@/components/auth/header'
import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

const AuthError = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-l from-sky-500 to-blue-800">
            <CardWrapper
                headerLabel='Ops! Something went wrong!'
                backButtonHref='/auth/login'
                backButtonLabel='Back to login'
            >
                <div className='w-full flex justify-center items-center'>
                    <FaExclamationCircle className='h-5 w-5 text-destructive' />
                </div>
            </CardWrapper>
        </div>
    )
}

export default AuthError