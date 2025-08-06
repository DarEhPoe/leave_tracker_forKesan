
"use server"
import {eq} from 'drizzle-orm'
import {flattenValidationErrors} from 'next-safe-action'
import {redirect} from 'next/navigation'

import {db} from '@/db'
import {trackers} from '@/db/schema'
import {actionClient} from '@/lib/safe-action'
import { insertTrackerSchema,type insertTrackerSchemaType } from '@/zod-schemas/tracker'

import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server'

export const saveTrackerAction=actionClient
    .metadata({actionName:'saveTicketAction'})
    .schema(insertTrackerSchema,{
        handleValidationErrorsShape:async (ve)=>flattenValidationErrors(ve).fieldErrors,

    })
    .action(async ({
        parsedInput:tracker
    }:{parsedInput:insertTrackerSchemaType})=>{
        const {isAuthenticated}=getKindeServerSession()
        const isAuth=await isAuthenticated()
        if(!isAuth) redirect('/login');
        if(tracker.id == '(New)'){
            const result=await db.insert(trackers).values({
                employeeId:Number(tracker.employeeId),
                trackertypeId:Number(tracker.trackertypeId),
                leaveDate:tracker.leaveDate,
                returnDate:tracker.returnDate,
                leaveday: Number(tracker.leaveday),
                totaltime: tracker.totaltime || null, 
                approved:tracker.approved,
                received:tracker.received,
            }).returning({insertedId:trackers.id})
        
            return { message: `Tracker ID #${result[0].insertedId} created successfully` };
        }

        //updating ticket

        const result=await db.update(trackers)
            .set({
                employeeId:Number(tracker.employeeId),
                trackertypeId:Number(tracker.trackertypeId),
                leaveDate:tracker.leaveDate,
                returnDate:tracker.returnDate,
                leaveday: Number(tracker.leaveday),
                totaltime: tracker.totaltime || null, 
                approved:tracker.approved,
                received:tracker.received,
            })
            .where(eq(trackers.id,tracker.id!))
            .returning({updatedId:trackers.id})
        return {message:`Tracker ID #${result[0].updatedId} updated successfully`}
    })