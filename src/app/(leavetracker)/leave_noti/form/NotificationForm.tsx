"use client"

import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import {useAction} from "next-safe-action/hooks";
import {saveLeaveNotification} from "@/app/actions/saveLeaveNotification"
import {EmployeeSearchResultsType } from "@/lib/queries/getEmployeeSearchResults";   
import { toast } from "sonner"; // Correct import
import { LoaderCircle } from "lucide-react";
import {DisplayServerActionResponse} from "@/components/DisplayServerActionResponse";
import {insertLeaveNotificationSchemaType,insertLeaveNotificationSchema} from "@/zod-schemas/leavenotification"
import { Form } from "@/components/ui/form"
import { TextareaWithLabel } from "@/components/inputs/textInputWithLabel";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { InputDateWithLabel } from "@/components/inputs/inputDateWithLabel";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Use NEXT_PUBLIC_EMAIL_FOR_SEND_NOTIFICATION for client-side env variable
const EMAIL_FOR_SEND_NOTIFICATION = process.env.NEXT_PUBLIC_EMAIL_FOR_SEND_NOTIFICATION
  ? JSON.parse(process.env.NEXT_PUBLIC_EMAIL_FOR_SEND_NOTIFICATION)
  : []; 

const NEXT_PUBLIC_MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL 

type Props={
    employee:EmployeeSearchResultsType[0],
    username:string,
    departmentType:DataObj[],

}

export default function TicketForm({
    employee,username,departmentType
}:Props){


    const defaultValues:insertLeaveNotificationSchemaType={
        id:0,
        employeeId: employee.id,
        fullName: employee.name, // Pre-populate with actual employee name
        activityType: "",
        departmentId: typeof employee.departmentId === "number" ? employee.departmentId : 0,
        travelWith: "",
        description: "",
        leaveDate: "",
        arrivalDate: "",
    }
    const form=useForm<insertLeaveNotificationSchemaType>({
        mode:"onBlur",
        resolver:zodResolver(insertLeaveNotificationSchema),
        defaultValues,
    })

    const {
        execute:executeSave,
        result:saveResult,
        isExecuting:isSaving,
        reset:resetSaveAction,
      }=useAction(saveLeaveNotification,{
    
            onSuccess({ data }) {
                toast.success("Success!", {
                    description: data?.message,
                });



                // Defensive check for empty recipients
                if (!EMAIL_FOR_SEND_NOTIFICATION || EMAIL_FOR_SEND_NOTIFICATION.length === 0) {
                    console.error("No email recipients defined in EMAIL_FOR_SEND_NOTIFICATION.");
                    return;
                }
                const allEmails = EMAIL_FOR_SEND_NOTIFICATION;

                fetch("/api/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: allEmails,
                        subject: `Notification of ${data?.activityType}`,
                        body: `
                            <html>
                            <head>
                                <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    color: #333;
                                    margin: 0;
                                    padding: 20px;
                                    background-color: #f4f4f4;
                                }
                                .email-container {
                                    background-color: #ffffff;
                                    border-radius: 8px;
                                    padding: 20px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h2 {
                                    color: #333;
                                }
                                p {
                                    font-size: 14px;
                                    line-height: 1.6;
                                }
                                .important {
                                    font-weight: bold;
                                    color: #e74c3c;
                                }
                                a {
                                    color: #3498db;
                                    text-decoration: none;
                                }
                                .footer {
                                    font-size: 12px;
                                    color: #777;
                                    margin-top: 20px;
                                }
                                </style>
                            </head>
                            <body>
                                <div class="email-container">
                                <h2>Notification: ${data?.activityType}</h2>
                                <p>Dear Admin and Program Directors,</p>
                                <p>I hope this message finds you well. This notification was submitted by ${username}</p>
                                <p>The detailed information is provided below:</p>
                                <p><strong>Full Name:</strong> ${data?.fullName}</p>
                                <p><strong>Activity Type:</strong> ${data?.activityType}</p>
                                <p><strong>Travel With:</strong> ${data?.travelWith}</p>
                                <p><strong>Description:</strong> ${data?.description}</p>
                                <p><strong>Leave Date:</strong> ${data?.leaveDate}</p>
                                <p><strong>Arrival Date:</strong> ${data?.arrivalDate}</p>
                                <p><a href="${NEXT_PUBLIC_MAIN_URL}/leave_notification/form?notificationId=${data?.id}">You can read in admin dashboard by clicking the link</a></p>
                                </div>
                            </body>
                            </html>
                        `
                    }),
                }).then(async (res) => {
                    if (!res.ok) {
                        const error = await res.json();
                        console.error("Email failed:", error.message);
                    }
                });
            },
    })    

    async function submitForm(data:insertLeaveNotificationSchemaType) {
        const toastId = toast(
            <div className="p-4 text-center max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center">
                <p className="text-base mb-2 text-gray-900 dark:text-gray-100">
                    After you submit this notification you can&apos;t update it.<br />
                    Please confirm to continue or cancel to go back.
                </p>
                <div className="flex gap-4 mt-4 justify-center">
                    <button
                        className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        onClick={() => {
                            executeSave(data);
                            toast.dismiss(toastId);
                        }}
                    >
                        ✅ Confirm Submit
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                        onClick={() => toast.dismiss(toastId)}
                    >
                        ❌ Cancel
                    </button>
                </div>
            </div>,
            {
                className: "rounded-xl shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-w-[320px] max-w-[90vw]",
                duration: 10000,
            }
        );
    }

    return(
        <div className="flex flex-col gap-1 sm:px-9">
            <DisplayServerActionResponse result={saveResult}/>    
            <div>
                <h2 className="text-2xl font-bold">Create a Travel notification.</h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full ">
                        <div className="flex flex-col sm:flex-row gap-8">
                            <div className="flex flex-col w-full max-w-xs gap-6">
                                
                                    <InputWithLabel<insertLeaveNotificationSchemaType>
                                        fieldTitle="Full Name"
                                        nameInSchema="fullName"
                                        className="mb-2 px-3 py-2"
                                    />


                                    <div className="flex flex-col gap-2 w-full max-w-xs mb-2">
                                        <label className="text-base mb-2">Department</label>
                                        <Select
                                            value={form.watch("departmentId")?.toString()}
                                            onValueChange={value => form.setValue("departmentId", Number(value))}
                                        >
                                            <SelectTrigger className="w-full" >
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departmentType.map(dep => (
                                                    <SelectItem key={dep.id} value={dep.id.toString()}>{dep.description}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <InputWithLabel<insertLeaveNotificationSchemaType>
                                        fieldTitle="Travel With"
                                        nameInSchema="travelWith"
                                        className="mb-2 px-3 py-2"
                                    />
                                    <InputDateWithLabel<insertLeaveNotificationSchemaType>
                                        fieldTitle="Leave Date"
                                        nameInSchema="leaveDate"
                                        className="mb-2 px-3 py-2"
                                    />
                                    
                                 

                            </div>
                            <div className="flex flex-col w-full max-w-xs gap-6 ">
                                    <div className="flex flex-col gap-2 w-full max-w-xs mb-2">
                                        <label className="text-base mb-2 ">Activity Type</label>
                                        <Select
                                            value={form.watch("activityType")}
                                            onValueChange={value => form.setValue("activityType", value)}
                                        >
                                            <SelectTrigger className="w-full" >
                                                <SelectValue placeholder="Select activity type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Field activity">Field activity</SelectItem>
                                                <SelectItem value="Attend meeting">Attend meeting</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <InputDateWithLabel<insertLeaveNotificationSchemaType>
                                        fieldTitle="Arrival Date"
                                        nameInSchema="arrivalDate"
                                        className="mb-2 px-3 py-2"
                                    />   

                                    <TextareaWithLabel<insertLeaveNotificationSchemaType>
                                        fieldTitle="Description"
                                        nameInSchema="description"
                                        className="mb-2 px-3 py-2"
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
                                    {isSaving ? <LoaderCircle className="animate-spin">Saving</LoaderCircle> : "Save"}
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

