"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { settings } from '@/actions/settings'
import { FormError } from '@/components/form.error'
import { FormSuccess } from '@/components/form.success'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FormField, FormItem, FormLabel, FormMessage, Form, FormDescription, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'
import { SettingsSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { UserRole } from "@prisma/client"
import { Switch } from "@/components/ui/switch"

const Settings = () => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();


  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: undefined,
      newPassword: undefined,
      role: user?.role,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    }
  })
  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((res) => {
          if (res.error) {
            setError(res.error)
          }
          else {
            setSuccess(res.success)
          }
        })
        .catch((err) => {
          setError("Something went wrong")
        })
    })

  }

  return (
    <Card className='w-[600px] '>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>Settings</p>
      </CardHeader>
      <CardContent>
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
              {
                user?.isOAuth === false && (
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
                      placeholder="aytechlabo@gmail.com"
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
                    <FormLabel>Actual Password</FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      className="w-full"
                      disabled={isPending}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      {...field}
                      type="newPassword"
                      placeholder="********"
                      className="w-full"
                      disabled={isPending}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-rol items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">

                      <FormLabel>Two factor authentification</FormLabel>
                      <FormDescription>
                        You can manage role user here
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        disabled={isPending}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
                  </>
                )
              }
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can manage role user here
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} variant={'primary'} type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default Settings 