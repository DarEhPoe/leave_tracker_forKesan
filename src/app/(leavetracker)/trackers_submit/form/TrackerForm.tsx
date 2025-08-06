"use client"

import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import {InputDateWithLabel} from "@/components/inputs/inputDateWithLabel"
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import {useAction} from "next-safe-action/hooks";
import {saveTrackerAction} from "@/app/actions/saveTrackerAction"
import { toast } from "sonner"; // Correct import
import {type selectEmployeeSchemaType } from "@/zod-schemas/employee";
import {type selectTrackerTypeSchemaType } from "@/zod-schemas/trackertype";
import { LoaderCircle } from "lucide-react";
import {DisplayServerActionResponse} from "@/components/DisplayServerActionResponse";
import { Form } from "@/components/ui/form"

import { insertTrackerSchema,type insertTrackerSchemaType,type selectTrackerSchemaType

 } from "@/zod-schemas/tracker"
 type Props={
    employee?:selectEmployeeSchemaType,
    tracker?:selectTrackerSchemaType,
    trackertypes?:selectTrackerTypeSchemaType,
    type:DataObj[],
    dayChoose:DataObj[],
    employeeName:DataObj[],
    totaltime:DataObj[],
 }

export default function TicketForm({
    tracker,type,employeeName,dayChoose,totaltime
}:Props){
    const defaultValues:insertTrackerSchemaType={
        id:tracker?.id ?? "(New)",
        employeeId:tracker?.employeeId ?? 0 ,
        trackertypeId:tracker?.trackertypeId?? 0,
        leaveDate:tracker?.leaveDate?? '',
        returnDate:tracker?.returnDate?? '',
        leaveday:tracker?.leaveday?? '',
        totaltime:tracker?.totaltime??'',
        approved:tracker?.approved?? false,
        received:tracker?.received?? false,
        }
    const form=useForm<insertTrackerSchemaType>({
        mode:"onBlur",
        resolver:zodResolver(insertTrackerSchema),
        defaultValues,
    })

    const {
        execute:executeSave,
        result:saveResult,
        isExecuting:isSaving,
        reset:resetSaveAction,
      }=useAction(saveTrackerAction,{
        onSuccess({data}){
          //toast user
          toast.success(
            "Success!",{
              description:data?.message,
            }
          )
        },
    })    

    async function submitForm(data:insertTrackerSchemaType) {
        executeSave(data);
    }

    return(
        <div className="flex flex-col gap-1 sm:px-9">
            <DisplayServerActionResponse result={saveResult}/>    
            <div>
                <h2 className="text-2xl font-bold">{tracker?.id ? "Edit" : "New"} Leave Tracker {tracker?.id?`#${tracker.id}`:"Form"} </h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full ">
                        <div className="flex flex-col sm:flex-row gap-8">
                            <div className="flex flex-col w-full max-w-xs gap-8">
                                <SelectWithLabel <insertTrackerSchemaType>
                                    fieldTitle="Name"
                                    nameInSchema="employeeId"
                                    data={employeeName}
                                />
                                <SelectWithLabel <insertTrackerSchemaType>
                                    fieldTitle="Type"
                                    nameInSchema="trackertypeId"
                                    data={type}
                                />
                                <SelectWithLabel <insertTrackerSchemaType>
                                    fieldTitle="Number of Days"
                                    nameInSchema="leaveday"
                                    data={dayChoose}
                                />

                            </div>

                            <div className="w-full flex flex-col max-w-xs gap-8">
                                <InputDateWithLabel <insertTrackerSchemaType>
                                    fieldTitle="Date of Leave"
                                    nameInSchema="leaveDate"
                                />


                                <InputDateWithLabel <insertTrackerSchemaType>
                                    fieldTitle="Date of Return"
                                    nameInSchema="returnDate"
                                />
                                <SelectWithLabel <insertTrackerSchemaType>
                                    fieldTitle="Hours (optinal)"
                                    nameInSchema="totaltime"
                                    data={totaltime}
                                />
                            </div>
                        </div>





                        <div className="flex flex-col gap-4 w-full max-w-xs">
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
                    </div>

              
                </form>
            
            </Form>

        </div>

    )
}

