import TrackerForm from "@/app/(leavetracker)/leave_noti/form/NotificationForm";
import {getUserNameFromAuth} from "@/lib/getUserInfoFromKinde";
import { getEmployeeSearchResults } from "@/lib/queries/getEmployeeSearchResults";


export const dynamic = 'force-dynamic';

// export async function generateMetadata({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) {
//   const { employeeId, trackerId } = await searchParams;

//   if (!employeeId && !trackerId)
//     return { title: "New Tracker" };

//   if (employeeId) {
//     return { title: `New Tracker for employee #${employeeId}` };
//   }

//   if (trackerId) {
//     return { title: `Edit Tracker #${trackerId}` };
//   }
// }

export default async function TrackerFormPage() {
    const username= await getUserNameFromAuth()
    const employees = await getEmployeeSearchResults(username);

    // Handle case where no employees are found
    if (!employees || employees.length === 0) {
        return (
            <div className="flex flex-col gap-4 p-6">
                <h2 className="text-2xl font-bold text-red-600">Error</h2>
                <p>No employee data found. Please contact your administrator.</p>
            </div>
        )
    }

    return (
      <TrackerForm employee={employees[0]} username={username} />
    )

}
  
