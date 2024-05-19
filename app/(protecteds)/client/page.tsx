"use client"

import { UserInfo } from '@/components/user-info';
import { useCurrentUser } from '@/hooks/use-current-user';
import React from 'react'

const ClientPage = () => {
    const user =  useCurrentUser();
    console.log('user:',user)
  return (
    <UserInfo
    label='Client component'
    user={user}
    />
  )
}

export default ClientPage