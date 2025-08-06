"use client"
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormItem,
    FormField,
    FormMessage,
    FormLabel
    
} from "@/components/ui/form";

import { InputHTMLAttributes } from "react";


type Props<S>={
    fieldTitle:string,
    nameInSchema:keyof S & string,
    className?:string
}& InputHTMLAttributes<HTMLInputElement>

export function InputDateWithLabel<S>({
fieldTitle,
nameInSchema,
className,
...props
}:Props<S>){
    const form =useFormContext();

    return(
        <FormField control={form.control}
            name={nameInSchema}
            render={({field})=>(
                <FormItem>
                    <FormLabel
                    className="text-base"
                    htmlFor={nameInSchema}
                    >
                        {fieldTitle}
                    </FormLabel>

                        <FormControl>
                            <Input
                                type="date"
                                id={nameInSchema}
                                className={`w-full max-w-xs disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 ${className}`}
                                {...props}
                                {...field}
                            />
                        </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        ></FormField>    
    )

}