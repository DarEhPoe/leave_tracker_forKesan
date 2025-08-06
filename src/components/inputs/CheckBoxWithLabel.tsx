"use client"
import { Checkbox} from "../ui/checkbox";
import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormItem,
    FormField,
    FormMessage,
    FormLabel
    
} from "@/components/ui/form";



type Props<S>={
    fieldTitle:string,
    nameInSchema:keyof S & string,
    message:string,
    disable?:boolean

}

export function CheckBoxWithLabel<S>({
fieldTitle,
nameInSchema,
message,
disable=false
}:Props<S>){
    const form =useFormContext();

    return(
        <FormField control={form.control}
            name={nameInSchema}
            render={({field})=>(
                <FormItem
                className="w-full flex items-center gap-2"
                >
                    <FormLabel
                    className="text-base w-1/3 mt-2"
                    htmlFor={nameInSchema}
                    >
                        {fieldTitle}
                    </FormLabel>

                    <div className="flex items-center gap-2 mt-2">

                        <FormControl>
                            <Checkbox
                            id={nameInSchema}

                            {...field}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disable}
                            >
                            </Checkbox>
                        </FormControl>  
                        {message}                  
                    </div>


                    <FormMessage/>
                </FormItem>
            )}
        ></FormField>    
    )

}