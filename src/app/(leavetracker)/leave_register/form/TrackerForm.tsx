"use client"

import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import {InputDateWithLabel} from "@/components/inputs/inputDateWithLabel"
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import {useAction} from "next-safe-action/hooks";
import {saveTrackerAction} from "@/app/actions/saveTrackerAction"
import { toast } from "sonner"; // Remove dismiss import
import {type selectEmployeeSchemaType } from "@/zod-schemas/employee";
import {type selectDepartmentSchemaType } from "@/zod-schemas/department";
import {type selectTrackerTypeSchemaType } from "@/zod-schemas/trackertype";
import { LoaderCircle } from "lucide-react";
import {DisplayServerActionResponse} from "@/components/DisplayServerActionResponse";
import { Form } from "@/components/ui/form"


// Use NEXT_PUBLIC_EMAIL_TO_SENDS for client-side env variable, with safe fallback
const EMAIL_TO_SENDS = process.env.NEXT_PUBLIC_EMAIL_TO_SENDS
  ? JSON.parse(process.env.NEXT_PUBLIC_EMAIL_TO_SENDS)
  : {};
const EMAIL_EXECUTIVE_DIRECTOR = process.env.NEXT_PUBLIC_EMAIL_OF_EXECUTIVE_DIRECTOR || "";
const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL
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
    program:selectDepartmentSchemaType,
    username:string


 }

export default function TicketForm({
    tracker,type,employeeName,dayChoose,totaltime,program,username,
}:Props){

    const defaultValues:insertTrackerSchemaType={
        id:tracker?.id ?? "(New)",
        employeeId:tracker?.employeeId ?? 0 ,
        trackertypeId:tracker?.trackertypeId?? 0,
        leaveDate:tracker?.leaveDate?? '',
        returnDate:tracker?.returnDate?? '',
        leaveday:tracker?.leaveday?? '',
        totaltime:tracker?.totaltime??'',
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
    
            onSuccess({ data }) {

            toast.success("Success!", {
                description: data?.message,
            });

            // ✅ Send the email here (example using fetch)

            const programs: string = program.name;
            // Flexible matching for program name
            const foundKey = Object.keys(EMAIL_TO_SENDS).find(
              key => key.toLowerCase() === programs.trim().toLowerCase()
            );
            if (foundKey) {
                const emails = EMAIL_TO_SENDS[foundKey];
                if (foundKey !== "Admin" && EMAIL_EXECUTIVE_DIRECTOR) {
                    emails.push(EMAIL_EXECUTIVE_DIRECTOR);
                }
                fetch("/api/send-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                        to: emails,
                        subject: "Leave Request Submission for Approval",
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
                                <h2>Leave Request Submission for Approval</h2>
                                <p>Dear Thara Paul Sein Twa and Program Directors,</p>
                                <p>I hope this message finds you well.</p>
                                <p>A leave request has been submitted by <strong>${username}</strong>. Kindly review the request at the following link:</p>
                                <p><a href="${MAIN_URL}/trackers_submit">Leave Request Link</a></p>
                                <p><span class="important">Important:</span></p>
                                <ul>
                                    <li>As the Executive Director, your approval is required for this leave request to be processed.</li>
                                    <li>Additionally, one of the Program Directors must also approve this request.</li>
                                    <li>If the request has already been approved by either party, no further action is needed.</li>
                                </ul>
                                <p>Should you have any questions or require further information, please feel free to reach out.</p>
                                <p>Thank you for your attention to this matter.</p>
                                <p class="footer">Best regards,<br></br>KESAN Leave Tracker System</p>
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
            } else {
                console.error("Invalid program name:", programs, Object.keys(EMAIL_TO_SENDS));
            }

        },
    })    

    async function submitForm(data:insertTrackerSchemaType) {
        const toastId = toast(
            <div className="p-4 text-center max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center">
                <p className="text-base mb-2 text-gray-900 dark:text-gray-100">
                    After you submit this leave request you can&apos;t update it.<br />
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
                <h2 className="text-2xl font-bold">{tracker?.id ? "Edit" : "New"} Leave Register Form {tracker?.id?`#${tracker.id}`:"Form"} </h2>
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
                                    fieldTitle="Hours (optional)"
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

