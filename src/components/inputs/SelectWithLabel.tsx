"use client"
import {useFormContext } from "react-hook-form";
import {
    FormControl,
    FormItem,
    FormField,
    FormMessage,
    FormLabel
    
} from "@/components/ui/form";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";



type Props<S>={
    fieldTitle:string,
    nameInSchema:keyof S & string,
    data:DataObj[]
    className?:string

}

export  function SelectWithLabel<S>({
    fieldTitle,
    nameInSchema,
    data,
    className
}:Props<S>){

    const form=useFormContext();
    return(
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({field})=>(
                <FormItem>
                    <FormLabel
                    className="text-base"
                    htmlFor={nameInSchema}
                    >
                        {fieldTitle}
                    </FormLabel>
                    <Select 
                        value={field.value?.toString()}
                        onValueChange={field.onChange}
                        >
                        <FormControl>
                            <SelectTrigger id={nameInSchema} className={`w-full max-w-xs ${className}`}>
                            <SelectValue>
                                {
                                data.find(item => item.id.toString() === field.value?.toString())?.description ?? "Select"
                                }
                            </SelectValue>
                            </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                        {data.length > 0 ? (
                            data.map(item => (
                                <SelectItem key={item.id.toString()} value={item.id.toString()}>
                                {item.description}
                                </SelectItem>
                            ))
                            ) : (
                            <SelectItem value="add" disabled={true}>No data exit, add the data in menu</SelectItem>
                            )}
                        </SelectContent>
                    </Select>

                    <FormMessage/>
                </FormItem>
            )}
        >

        </FormField>
    )

}