"use client"

import {useRouter} from "next/navigation"
import { Button } from "./ui/button"

import { ButtonHTMLAttributes } from "react"

type Pros={
    title:string,
    className?:string,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,
} & ButtonHTMLAttributes<HTMLButtonElement>

import React from 'react'

export default function BackButton({
    title,variant,className,
}:Pros) {

    const router=useRouter();
  return (
    <Button
        variant={variant}
        className={className}
        onClick={()=> router.back()}
        title={title}
    >
        {title}
    </Button>
  )
}
