
import EmployeeSearch from "@/app/(leavetracker)/employee/EmployeeSearch"
import {getEmployeeSearchResults} from "@/lib/queries/getEmployeeSearchResults"
import {getAllEmployee} from "@/lib/queries/getAllemployee"
import EmployeeTable from "@/app/(leavetracker)/employee/EmployeeTable"
export const metadata={
    title:"EmployeeSearch"
}
export const dynamic = 'force-dynamic';

export default async function EmployeePage({
  searchParams,
}:{
  searchParams:Promise<{[key:string]:string | undefined}>
}){
  const {searchText}=await searchParams;
  if(!searchText){
    const results=await getAllEmployee();
    return (
      <>
        <EmployeeSearch/>
        {results.length?<EmployeeTable data={results}/>:(
        <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">No employee data exists; add the employee in the menu.</p>
      )}
            
      </>
    )
  }


  const results=await getEmployeeSearchResults(searchText);
  return(
    <>
      <EmployeeSearch/>
      {results.length?<EmployeeTable data={results}/> :(
        <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">{`No ${searchText} found in employee`} </p>
      )}
      
    </>
  )

}