
"use server"
import {eq} from 'drizzle-orm'
import {flattenValidationErrors} from 'next-safe-action'
import {redirect} from 'next/navigation'
import {db} from '@/db'
import {departments} from '@/db/schema'
import {actionClient} from '@/lib/safe-action'
import { insertDepartmentSchema,type insertDepartmentSchemaType } from '@/zod-schemas/department'
import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server'

export const saveDepartmentAction=actionClient
    .metadata({actionName:'saveDepartmentNameAction'})
    .schema(insertDepartmentSchema,{
        handleValidationErrorsShape:async (ve)=>flattenValidationErrors(ve).fieldErrors,
 
    })
    .action(async ({
        parsedInput:department
    }:{parsedInput:insertDepartmentSchemaType})=>{
        const {isAuthenticated}=getKindeServerSession()
        const isAuth=await isAuthenticated()
        if(!isAuth) redirect('/login');
        if(department.id===0){
            const result=await db.insert(departments).values({
                name:department.name,

            }).returning({insertedId:departments.id})        
            return {message:`Department ID #${result[0].insertedId} created successfully`}
        }

        //Existing customer
        const result=await db.update(departments)
        .set({
            name:department.name,
        })
        .where(eq(departments.id,department.id!))
        .returning({updatedId:departments.id})
        return {message:`Department ID #${result[0].updatedId } updated successfully`}
    })