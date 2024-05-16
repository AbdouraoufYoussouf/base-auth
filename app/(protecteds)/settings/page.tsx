import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import React from 'react'

const Settings = async () => {
  const session = await auth()
  return (
    <div>
      <h2>Session Details:</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <form action={async () => {
        "use server";
        await signOut({
          redirect: true,
          redirectTo: `/auth/login`
        });
      }}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  )
}

export default Settings 