export const dynamic = 'force-dynamic'

import NotificationTable from "@/app/(leavetracker)/leave_noti/NotificationTable"
import {getAllNotification} from "@/lib/queries/getAllNotification"
import {getUserNameFromAuth} from "@/lib/getUserInfoFromKinde"
import {getEmployeeSearchResults} from "@/lib/queries/getEmployeeSearchResults"


export const metadata = {
  title: "TrackerSearch"
}

export default async function TrackerPage(){
  // Get the user name

  const name = await getUserNameFromAuth()
  const employee=await getEmployeeSearchResults(name)
  const employeeId=employee[0].id
  const notification = await getAllNotification();
  const results=notification.filter(data=> data.employeeId==employeeId)


  return (
    <div className="p-4">
      {results.length ? (
        <NotificationTable data={results} />
      ) : (
        <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">
          No Travel notification found; you can add the new travel notification in the menu.
        </p>
      )}
    </div>
  )
}
