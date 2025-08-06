"use client"
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import {useAction} from "next-safe-action/hooks";
import {saveDepartmentAction} from "@/app/actions/saveDepartment"
import { toast } from "sonner"; // Correct import
import { LoaderCircle } from "lucide-react";
import {DisplayServerActionResponse} from "@/components/DisplayServerActionResponse";
import { Form } from "@/components/ui/form"

import { insertDepartmentSchema,type insertDepartmentSchemaType,type selectDepartmentSchemaType

 } from "@/zod-schemas/department"
 type Props={
    department?:selectDepartmentSchemaType,

 }

export default function DepartmentForm({
    department
}:Props){
    const defaultValues:insertDepartmentSchemaType={
        id:department?.id ?? 0,
        name:department?.name ?? '',
    }
    const form=useForm<insertDepartmentSchemaType>({
        mode:"onBlur",
        resolver:zodResolver(insertDepartmentSchema),
        defaultValues,
    })

    const {
        execute:executeSave,
        result:saveResult,
        isExecuting:isSaving,
        reset:resetSaveAction,
      }=useAction(saveDepartmentAction,{
        onSuccess({data}){
          //toast user
          toast.success(
            "Success!",{
              description:data?.message,
            }
          )
        },
    })    

    async function submitForm(data:insertDepartmentSchemaType) {
        executeSave(data);
    }

    return(
        <div className="flex flex-col gap-1 sm:px-9">
            <DisplayServerActionResponse result={saveResult}/>    
            <div>
                <h2 className="text-2xl font-bold">{department?.id ? "Edit" : "New"} Program {department?.id?`#${department.id}`:"Form"} </h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabel <insertDepartmentSchemaType>
                            fieldTitle="Name"
                            nameInSchema="name"
                        />
                        <div className="flex gap-2">
                            <Button 
                                    type="submit"
                                    className="w-3/4"
                                    variant="default"
                                    title="save"
                                    disabled={isSaving}
                            >
                                {
                                    isSaving?(
                                        <>
                                            <LoaderCircle className="animate-spin">Saving</LoaderCircle>
                                        </>
                                    ):"Save"
                                            }
                            </Button>
                            <Button 
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={()=>{
                                    form.reset(defaultValues)
                                    resetSaveAction()
                                            
                                        
                                    }}
                            >
                                Reset
                            </Button> 

                        </div>
                    </div>
                </form>
            
            </Form>

        </div>

    )
}

