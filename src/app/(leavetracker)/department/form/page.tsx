import { getDepartment } from "@/lib/queries/getDepartment";
import BackButton from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs"
import DepartmentForm from "@/app/(leavetracker)/department/form/DepartmentForm";
export const dynamic = 'force-dynamic';

export async function generateMetadata({
    searchParams,
}:{
    searchParams:Promise<{[key:string]:string | undefined}>
}) {
    const {departmentId}=await searchParams;
    if(!departmentId)return {title:"New department"}
    return{title:`Edit department#${departmentId}`}
}
export default async function TrackerTypeFormPage({
    searchParams,
}:{
    searchParams:Promise<{[key:string]:string | undefined}>
}) {

    try{


        const {departmentId}=await searchParams

        //Edit customer form

        if(departmentId){
            const department=await getDepartment(parseInt(departmentId));

            if(!departmentId){
                return(
                    <>
                        <h2 className="text-2xl mb-2">Department Id # {departmentId} not found</h2>
                        <BackButton title="Go Back" variant="default"/> 
                    </>
                )
            }
            return <DepartmentForm key={departmentId} department={department}/>
        }else{
            return <DepartmentForm key="new" />
        }

    }catch(e){
        if (e instanceof Error){
            Sentry.captureException(e)
            throw e
        }
    }

}
