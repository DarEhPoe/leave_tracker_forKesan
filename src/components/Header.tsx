import React from 'react'
import getAllTrackers from '@/lib/queries/getAllTrackers';
import { getAllEmployee } from '@/lib/queries/getAllemployee';
import Dashboard from "@/components/Dashboard";
import {getUserPermissions} from "@/lib/getUserInfoFromKinde"

export default async function Header({
    children,
}:{children:React.ReactNode}) {
    const tracker = await getAllTrackers();
    const employee=await getAllEmployee();
    const permissions=await getUserPermissions();

    const uniqueYears = Array.from(
    new Set(
        tracker
        .map((data) => new Date(data.trackersDate).getFullYear())
        .filter((year) => !isNaN(year))
    )
    ).sort((a, b) => a - b);

  return (
    <header>
        <Dashboard  employee={employee} uniqueYears={uniqueYears} permissions={permissions} >
            {children}
        </Dashboard>
    </header>
  )
}
