'use client'

import React, { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from 'react-hook-form'
import { LoginSchema } from '@/schemas'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button, buttonVariants } from '../ui/button'
import { FormError } from '../form.error'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FormSuccess } from '../form.success'
import { handleLogin } from '@/actions/login.action'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const [twoFactor, setTwoFactor] = useState(false)
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>("")

    const searchParams = useSearchParams()
    const urlError = searchParams.get('error') === "OAuthAccountNotLinked" ?
        "Email already in use with different provider!" : ""

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            handleLogin(values)
                .then((data) => {
                    if (data?.error) {
                       
                        setError(data?.error);
                    }
                    if (data?.success) {
                        form.reset()
                        setSuccess(data?.success)
                    }
                    if (data?.twoFactor) {
                        setTwoFactor(true)
                    }
                })
                .catch(() => {
                    setError("Something went wrong");
                })
        })
    }
    return (
        <CardWrapper headerLabel='Welcom back'
            backButtonLabel="Don't have an account?"
            backButtonHref='/auth/register'
            showSocial>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className='space-y-4'>
                        {!twoFactor &&
                            <>

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
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-start justify-center">
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
                                            <Link className={clsx('text-sm text-blue-500 underline-offset-4 hover:underline',)} href='/auth/reset'>Forgot password</Link>
                                        </FormItem>
                                    )}
                                />
                            </>
                        }
                        {twoFactor &&
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two factro code</FormLabel>
                                        <Input
                                            {...field}
                                            placeholder="123456"
                                            className="w-full"
                                            disabled={isPending}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                    </div>

                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} variant={'primary'} type="submit" className="w-full">
                        { twoFactor? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}   
