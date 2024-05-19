"use client"

import React from 'react'
import { admin } from '@/actions/admin'
import { RoleGate } from '@/components/auth/role-gate'
import { FormSuccess } from '@/components/form.success'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserRole } from '@prisma/client'
import { useToast } from "@/components/ui/use-toast"
import { toast } from 'sonner'

const AdminPage = () => {
    const onApiRouteClick = () => {
        fetch("/api/admin")
            .then((res) => {
                if (res.ok) {
                    toast.success("Api route success")
                } else {
                    toast.error("Api route error")
                }
            })
    }
    const onServerActionRouteClick = () => {
        admin()
            .then((res) => {
                if (res.success) {
                    toast.success("Server action route success")
                } else {
                    toast.error("Server action route error")
                }
            })
    }

    const userRole = UserRole;
    return (
        <Card className='w-[600px] '>
            <CardHeader>
                <p className='text-2xl font-semibold text-center'>Admin</p>
            </CardHeader>
            <CardContent className='space-y-4'>
                <RoleGate allowedRole={userRole.ADMIN}>
                    <FormSuccess message='You are allowed to see this content!' />
                </RoleGate>
                <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
                    <p className='text-sm font-medium'>Admin-only API ROUTE</p>
                    <Button onClick={onApiRouteClick}>Click to test</Button>
                </div>

                <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
                    <p className='text-sm font-medium'>Admin-only Server Action</p>
                    <Button onClick={onServerActionRouteClick}>Click to test</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminPage