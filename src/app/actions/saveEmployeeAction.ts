
"use server"
import {eq} from 'drizzle-orm'
import {flattenValidationErrors} from 'next-safe-action'
import {redirect} from 'next/navigation'

import {db} from '@/db'
import {employee} from '@/db/schema'
import {actionClient} from '@/lib/safe-action'
import { insertEmployeeSchema,type insertEmployeeSchemaType } from '@/zod-schemas/employee'

import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server'

export const saveEmployeeAction=actionClient
    .metadata({actionName:'saveEmployeeAction'})
    .schema(insertEmployeeSchema,{
        handleValidationErrorsShape:async (ve)=>flattenValidationErrors(ve).fieldErrors,

    })
    .action(async ({
        parsedInput:employe
    }:{parsedInput:insertEmployeeSchemaType})=>{
        const {isAuthenticated}=getKindeServerSession()
        const isAuth=await isAuthenticated()
        if(!isAuth) redirect('/login');
        if(employe.id===0){
            const result=await db.insert(employee).values({
                name:employe.name,
                departmentId:Number(employe.departmentId),


            }).returning({insertedId:employee.id})        
            return {message:`Employee ID #${result[0].insertedId} created successfully`}
        }

        //Existing customer
        const result=await db.update(employee)
        .set({
            name:employe.name,
            departmentId:Number(employe.departmentId),

        })
        .where(eq(employee.id,employe.id!))
        .returning({updatedId:employee.id})
        return {message:`Employee ID #${result[0].updatedId } updated successfully`}
    })