'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Loader } from '@/components/ui/loader';
import { LogOut } from 'lucide-react';
import { signIn,signOut } from 'next-auth/react';
import useSWRMutation from 'swr/mutation';

export const LogoutButton = () => {
  const { trigger, isMutating } = useSWRMutation('auth', signIn);

  return (
    <DropdownMenuItem className='text-red-500'
    onClick={() => signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/auth/login`
  })}
    >
      {isMutating ? <Loader /> : <LogOut className="mr-2 h-4 w-4" />}
      <span>Log out</span>
    </DropdownMenuItem>
  );
};
