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
    console.log("Employee",employees)

    return (
      <TrackerForm employee={employees[0]} username={username}/>
    )

}
  
