import { getTrackerType } from "@/lib/queries/getTrackerType";
import BackButton from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs"
import TrackerTypeForm from "@/app/(leavetracker)/tracker_type/form/TrackerTypeForm";
export const dynamic = 'force-dynamic';

export async function generateMetadata({
    searchParams,
}:{
    searchParams:Promise<{[key:string]:string | undefined}>
}) {
    const {trackertypeId}=await searchParams;
    if(!trackertypeId)return {title:"New TrackerType"}
    return{title:`Edit TrackerType#${trackertypeId}`}
}
export default async function TrackerTypeFormPage({
    searchParams,
}:{
    searchParams:Promise<{[key:string]:string | undefined}>
}) {

    try{


        const {trackertypeId}=await searchParams

        //Edit customer form

        if(trackertypeId){
            const trackertype=await getTrackerType(parseInt(trackertypeId));

            if(!trackertypeId){
                return(
                    <>
                        <h2 className="text-2xl mb-2">Tracker Type Id # {trackertypeId} not found</h2>
                        <BackButton title="Go Back" variant="default"/> 
                    </>
                )
            }
            return <TrackerTypeForm key={trackertypeId} trackertype={trackertype}/>
        }else{
            return <TrackerTypeForm key="new" />
        }

    }catch(e){
        if (e instanceof Error){
            Sentry.captureException(e)
            throw e
        }
    }

}
