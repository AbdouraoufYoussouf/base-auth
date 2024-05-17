'use client'

import React, { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from 'react-hook-form'
import { ResetSchema } from '@/schemas'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { reset } from '@/actions/reset'
import { FormError } from '../form.error'
import { FormSuccess } from '../form.success'

export const ResetPasswordForm = () => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {

        startTransition(() => {
            reset(values)
                .then((data) => {
                    setSuccess(data?.success);
                    setError(data?.error);
                })
        })
    }
    return (
        <CardWrapper headerLabel='Forgot your password'
            backButtonLabel="Go back Login"
            backButtonHref='/auth/register'
            >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="Email"
                                        className="w-full"
                                        disabled={isPending}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} variant={'primary'} type="submit" className="w-full">
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}   
