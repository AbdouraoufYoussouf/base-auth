"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import CardWrapper from './card-wrapper';
import { useSearchParams } from 'next/navigation';
import { deleteVerificationToken, newVerification } from '@/actions/new-verification';
import { FormError } from '../form.error';
import { FormSuccess } from '../form.success';

export const NewVerificationForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isLoading, setIsLoading] = useState(false); // Use isLoading for loading state
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const onSubmit = useCallback(async () => {
        if (!token) {
            setError('Missing token');
            return;
        }

        setIsLoading(true); // Set loading state to true before fetching

        try {
            const data = await newVerification(token);
            setSuccess(data.success);
            setError(data.error);
            if (data.success) {
                await deleteVerificationToken(token)
            }
        } catch (error) {
            console.error('Error verifying:', error);
            setError('Error verifying');
        } finally {
            setIsLoading(false); // Set loading state to false after fetching
        }
    }, [token]);

    useEffect(() => {
        onSubmit(); // Call onSubmit on component mount
    }, [onSubmit]); // Only re-run onSubmit if the token changes

    return (
        <CardWrapper
            headerLabel='Confirming your verification'
            backButtonLabel='Back to login'
            backButtonHref='/auth/login'
        >
            <div className='flex items-center justify-center'>
                {isLoading && (
                    <BeatLoader size={15} color={'#123abc'} loading={true} />
                )}
                <FormSuccess message={success} />
                {!success && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
};
