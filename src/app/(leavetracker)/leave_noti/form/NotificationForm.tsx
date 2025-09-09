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
const PHONE_FOR_SEND_NOTIFICATION = process.env.NEXT_PUBLIC_PHONE_FOR_SEND_NOTIFICATION
  ? JSON.parse(process.env.NEXT_PUBLIC_PHONE_FOR_SEND_NOTIFICATION)
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
                if (!PHONE_FOR_SEND_NOTIFICATION || PHONE_FOR_SEND_NOTIFICATION.length === 0) {

                    return;
                }

                // Normalize and dedupe phone numbers
                const recipients = Array.from(
                  new Set(
                    PHONE_FOR_SEND_NOTIFICATION
                    .map((p: string) => String(p ?? "").trim())
                    .filter(Boolean)
                  )
                );

                if (recipients.length === 0) {
                  return;
                }

                // Compose a concise SMS-friendly message
                function truncate(text: string, max: number) {
                  if (!text) return "";
                  return text.length > max ? text.slice(0, max - 1).trim() + "…" : text;
                }

                const link = `${NEXT_PUBLIC_MAIN_URL}/leave_notification/form?notificationId=${data?.id}`;
                const maxSmsLength = 600; // safe limit (well below 1600)
                const baseParts = [
                  "✅ Leave Notification",
                  `Type: ${data?.activityType ?? ""}`,
                  `Submitted by: ${username}`,
                  `Name: ${data?.fullName ?? ""}`,
                ].filter(Boolean);

                // Keep description short
                const shortNotes = truncate(String(data?.description ?? ""), 300);

                const parts = [
                  ...baseParts,
                  data?.travelWith ? `Travel with: ${truncate(data.travelWith, 80)}` : undefined,
                  data?.leaveDate ? `Leave: ${data.leaveDate}` : undefined,
                  data?.arrivalDate ? `Arrival: ${data.arrivalDate}` : undefined,
                  shortNotes ? `Description: ${shortNotes}` : undefined,
                  `View: ${link}`
                ].filter(Boolean);

                // join and ensure under maxSmsLength; if too long, aggressively truncate the body before the link
                let smsMessage = parts.join("\n");
                if (smsMessage.length > maxSmsLength) {
                  // preserve link, truncate the rest
                  const preservedLink = `\nView: ${link}`;
                  const allowed = maxSmsLength - preservedLink.length - 1;
                  smsMessage = truncate(parts.slice(0, -1).join(" "), allowed) + preservedLink;
                }

                // POST once with all deduped recipients
                fetch("/api/send-sms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: recipients,
                        message: smsMessage,
                    }),
                }).then(async (res) => {
                    const ct = res.headers.get("content-type") ?? "";
                    const body = ct.includes("application/json") ? await res.json().catch(()=>null) : await res.text().catch(()=>null);
                    if (!res.ok) {
                        console.error("SMS failed:", body ?? "(no body)");
                    } else {
                        console.log("SMS request accepted", body);
                    }
                }).catch(err => {
                    console.error("Failed to call /api/send-sms:", err);
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

