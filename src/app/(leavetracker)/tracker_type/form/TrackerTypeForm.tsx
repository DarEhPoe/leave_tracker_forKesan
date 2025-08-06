"use client"
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import {useAction} from "next-safe-action/hooks";
import {saveTrackerTypeAction} from "@/app/actions/saveTrackerTypeAction"
import { toast } from "sonner"; // Correct import
import { LoaderCircle } from "lucide-react";
import {DisplayServerActionResponse} from "@/components/DisplayServerActionResponse";
import { Form } from "@/components/ui/form"

import { insertTrackerTypeSchema,type insertTrackerTypeSchemaType,type selectTrackerTypeSchemaType

 } from "@/zod-schemas/trackertype"
 type Props={
    trackertype?:selectTrackerTypeSchemaType,

 }

export default function TrackerTypeForm({
    trackertype
}:Props){
    const defaultValues:insertTrackerTypeSchemaType={
        id:trackertype?.id ?? 0,
        name:trackertype?.name ?? '',
    }
    const form=useForm<insertTrackerTypeSchemaType>({
        mode:"onBlur",
        resolver:zodResolver(insertTrackerTypeSchema),
        defaultValues,
    })

    const {
        execute:executeSave,
        result:saveResult,
        isExecuting:isSaving,
        reset:resetSaveAction,
      }=useAction(saveTrackerTypeAction,{
        onSuccess({data}){
          //toast user
          toast.success(
            "Success!",{
              description:data?.message,
            }
          )
        },
    })    

    async function submitForm(data:insertTrackerTypeSchemaType) {
        executeSave(data);
    }

    return(
        <div className="flex flex-col gap-1 sm:px-9">
            <DisplayServerActionResponse result={saveResult}/>    
            <div>
                <h2 className="text-2xl font-bold">{trackertype?.id ? "Edit" : "New"} Tracker Type {trackertype?.id?`#${trackertype.id}`:"Form"} </h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabel <insertTrackerTypeSchemaType>
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

