export const dynamic = 'force-dynamic';

import TrackerTable from "@/app/(leavetracker)/trackers_submit/TrackerTable";
import getAllTrackers from "@/lib/queries/getAllTrackers";
import {getUserPermissions, getUserNameFromAuth} from "@/lib/getUserInfoFromKinde";
import { getEmployeeSearchResults } from "@/lib/queries/getEmployeeSearchResults";
import { getDepartment} from "@/lib/queries/getDepartment";
import type { TrackerSearchResultsType } from "@/lib/queries/getTrackersSearchResults";

export const metadata = {
  title: "TrackerSearch",
};

export default async function TrackerPage() {
  const permissions = await getUserPermissions();
  const username = await getUserNameFromAuth();
  const isAdmin = permissions.includes("admin");
  const isManager = permissions.includes("manager");


  const employeeSearchByName = await getEmployeeSearchResults(username);
  const employee_program = employeeSearchByName[0]?.program;
  


  let results: TrackerSearchResultsType = [];

  if(isManager && isAdmin){
    // If user has both admin and manager roles, show all trackers
    const allTracker = await getAllTrackers();
    results = allTracker;
  }
  else if(isManager){
    // If user is only manager, filter by their program
    const allTracker = await getAllTrackers();
    
    const filteredByProgram = [];
    for (const tracker of allTracker) {
      const program_id = tracker.program;
      const program = await getDepartment(Number(program_id));
      console.log("tracker program:", program?.name, "employee program:", employee_program);
      if (employee_program === program?.name) {
        filteredByProgram.push(tracker);
      }
    }
    results = filteredByProgram;
  }
  else {
    // If neither admin nor manager, show empty results
    results = [];
  }

  // Filter where either Received or Approved is "Not approved yet"
  const filteredResults = results.filter((tracker) => {
    return (
      tracker.Received_By_Supervisor === "Not approved yet" ||
      tracker.Approved_By_Executive_Director === "Not approved yet"
    );
  });

  return (
    <div className="p-4">
      {filteredResults.length ? (
        <TrackerTable data={filteredResults} />
      ) : (
        <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/10 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-80">
          No leave tracker found; you can add the new leave tracker in the menu.
        </p>
      )}
    </div>
  );
}
