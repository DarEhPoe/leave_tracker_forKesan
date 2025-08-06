
"use server"
import {eq} from 'drizzle-orm'
import {flattenValidationErrors} from 'next-safe-action'
import {redirect} from 'next/navigation'

import {db} from '@/db'
import {trackertypes} from '@/db/schema'
import {actionClient} from '@/lib/safe-action'
import { insertTrackerTypeSchema,type insertTrackerTypeSchemaType } from '@/zod-schemas/trackertype'

import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server'

export const saveTrackerTypeAction=actionClient
    .metadata({actionName:'saveTrackerTypeAction'})
    .schema(insertTrackerTypeSchema,{
        handleValidationErrorsShape:async (ve)=>flattenValidationErrors(ve).fieldErrors,

    })
    .action(async ({
        parsedInput:trackertype
    }:{parsedInput:insertTrackerTypeSchemaType})=>{
        const {isAuthenticated}=getKindeServerSession()
        const isAuth=await isAuthenticated()
        if(!isAuth) redirect('/login');
        if(trackertype.id===0){
            const result=await db.insert(trackertypes).values({
                name:trackertype.name,

            }).returning({insertedId:trackertypes.id})        
            return {message:`Tracker Type ID #${result[0].insertedId} created successfully`}
        }

        //Existing customer
        const result=await db.update(trackertypes)
        .set({
            name:trackertype.name,
        })
        .where(eq(trackertypes.id,trackertype.id!))
        .returning({updatedId:trackertypes.id})
        return {message:`Tracker Type ID #${result[0].updatedId } updated successfully`}
    })