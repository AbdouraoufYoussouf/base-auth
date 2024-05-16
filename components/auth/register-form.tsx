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
import { RegisterSchema } from '@/schemas'
import { handleRegister } from '@/actions/register.action'

export const RegisterForm = () => {
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword:""
        }
    })

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
        handleRegister(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success)
                })
        })
    }
    return (
        <CardWrapper headerLabel='Create an account'
            backButtonLabel="Already have an account?"
            backButtonHref='/auth/login'
            showSocial>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Rafien Doc"
                                        className="w-full"
                                        disabled={isPending}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="rafien@gmail.com"
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
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}   
