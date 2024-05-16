"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

interface BackButtonProps{
    href:string
    label:string
}

const BackButton = ({href,label}:BackButtonProps) => {
  return (
    <Button className='font-normal w-full' variant={'link'} size={'sm'} asChild>
        <Link href={href}>{label}</Link>
    </Button>
  )
}

export default BackButton