import { getEmployee } from "@/lib/queries/getEmployee";
import { getTracker } from "@/lib/queries/getTrackers";
import { getAllTrackerType } from "@/lib/queries/getAllTrackerType";
import { getTrackerType } from "@/lib/queries/getTrackerType";
import { getAllEmployee } from "@/lib/queries/getAllemployee";
import * as Sentry from "@sentry/nextjs";
import TrackerForm from "@/app/(leavetracker)/leave_tracker/form/TrackerForm";
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { employeeId, trackerId } = await searchParams;

  if (!employeeId && !trackerId)
    return { title: "New Tracker" };

  if (employeeId) {
    return { title: `New Tracker for employee #${employeeId}` };
  }

  if (trackerId) {
    return { title: `Edit Tracker #${trackerId}` };
  }
}

export default async function TrackerFormPage({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }) {
    try {
      const { trackerId } = await searchParams;
      const trackerIdNum = trackerId ? Number(trackerId) : null;
  
      const types = await getAllTrackerType();
      const employees = await getAllEmployee();
      const days=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      const time=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

    
      const trackerTypeOptions = types.map((data) => ({
        id: data.id,
        description: data.name,
      }));
      const totaltime = time.map((day) => ({
        id: day,
        description: day.toString().padStart(2, "0"), // e.g., 01, 02, ..., 31
      }));

      const dayOptions = days.map((day) => ({
        id: day,
        description: day.toString().padStart(2, "0"), // e.g., 01, 02, ..., 31
      }));
      
      const employeeOptions = employees.map((data) => ({
        id: data.id,
        description: data.name,
      }));
  
      if (trackerIdNum) {
        const tracker = await getTracker(trackerIdNum);
        const employeeOne = await getEmployee(tracker.employeeId);
        const trackerTypeOne = await getTrackerType(tracker.trackertypeId);
  
        return (
          <TrackerForm
            tracker={tracker}
            type={trackerTypeOptions}
            employeeName={employeeOptions}
            employee={employeeOne}
            trackertypes={trackerTypeOne}
            dayChoose={dayOptions}
            totaltime={totaltime}
          />
        );
      } else {
        return (
          <TrackerForm
            type={trackerTypeOptions}
            employeeName={employeeOptions}
            dayChoose={dayOptions}
            totaltime={totaltime}
          />
        );
      }
  
    } catch (e) {
      if (e instanceof Error) {
        Sentry.captureException(e);
        throw e;
      }
    }
  }
  
