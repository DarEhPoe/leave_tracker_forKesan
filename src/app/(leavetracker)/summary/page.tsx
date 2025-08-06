import getAllTrackers from "@/lib/queries/getAllTrackers";
import SummaryComponent from "@/app/(leavetracker)/summary/SummaryComponent";
import { getEmployee } from "@/lib/queries/getEmployee";
import {getAllTrackerType} from "@/lib/queries/getAllTrackerType"
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "SummarySearch",
};

export default async function SummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { employeeId } = await searchParams;

  if (!employeeId) {
    return (
      <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">
        No employee ID provided.
      </p>
    );
  }

  const results = await getAllTrackers();
  const trackertypes=await getAllTrackerType();
  const employees=await getEmployee(Number(employeeId))
  const tracker = results.filter((data) => data.employeeId === Number(employeeId));

  return (
    <>
      {tracker.length ? (
        <SummaryComponent tracker={tracker} trackertype={trackertypes} employee={employees} />
      ) : (
        <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">
          No summary available because there is no tracker data for employee #{employeeId}.
        </p>
      )}
    </>
  );
}
