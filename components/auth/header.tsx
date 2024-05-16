import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import React from 'react'
import { GrSecure } from 'react-icons/gr'

const font = Poppins({
    subsets:["latin"],
    weight:["600"]
})

interface HeaderProps{
    label?:string
}

const HeaderAuth = ({label}:HeaderProps) => {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
         <h1 className={cn("flex items-center justify-center text-3xl font-semibold drop-shadow-md ", font.className)}>
          <GrSecure />
          Auth</h1>
        <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  )
}

export default HeaderAuth