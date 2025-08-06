export const dynamic = 'force-dynamic';

import TrackerTable from "@/app/(leavetracker)/trackers_submit/TrackerTable";
import getAllTrackers from "@/lib/queries/getAllTrackers";

export const metadata = {
  title: "TrackerSearch",
};

export default async function TrackerPage() {
  // Fetch all trackers
  const results = await getAllTrackers();

  // Filter where either Received or Approved is false
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
