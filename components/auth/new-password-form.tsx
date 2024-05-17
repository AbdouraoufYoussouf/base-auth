'use client'

import React, { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from '../form.error'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FormSuccess } from '../form.success'
import { NewPasswordSchema } from '@/schemas'
import { useSearchParams } from 'next/navigation'
import { newPassword } from '@/actions/new-password'

export const NewPasswordForm = () => {
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            newPassword(values,token as string)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success)
                })
        })
    }
    return (
        <CardWrapper headerLabel='Enter a new password'
            backButtonLabel="Back to login"
            backButtonHref='/auth/login'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative w-full flex items-center">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="********"
                                            className="w-full"
                                            disabled={isPending}
                                        />
                                        <div onClick={() => setShowPassword(!showPassword)} className="absolute right-2">
                                            {
                                                showPassword ?
                                                    <FaEyeSlash className='h-5 w-5' />
                                                    :
                                                    <FaEye className='h-5 w-5' />
                                            }

                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <div className="relative w-full flex items-center">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="********"
                                            className="w-full"
                                            disabled={isPending}
                                        />
                                        <div onClick={() => setShowPassword(!showPassword)} className="absolute right-2">
                                            {
                                                showPassword ?
                                                    <FaEyeSlash className='h-5 w-5' />
                                                    :
                                                    <FaEye className='h-5 w-5' />
                                            }

                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} variant={'primary'} type="submit" className="w-full">
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}   
