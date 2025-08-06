export const dynamic = 'force-dynamic'

import TrackerTable from "@/app/(leavetracker)/leave_register/TrackerTable"
import getTrackerSearchResults from "@/lib/queries/getTrackersSearchResults"
import {getUserNameFromAuth} from "@/lib/getUserInfoFromKinde"


export const metadata = {
  title: "TrackerSearch"
}

export default async function TrackerPage(){
  // Get the user name

  const name = await getUserNameFromAuth()

  // Fetch the search results using the user's name
  const results = await getTrackerSearchResults(name);



  return (
    <div className="p-4">
      {results.length ? (
        <TrackerTable data={results} />
      ) : (
        <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">
          No leave tracker found; you can add the new leave tracker in the menu.
        </p>
      )}
    </div>
  )
}
