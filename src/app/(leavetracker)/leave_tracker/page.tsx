
import TrackerSearch from "@/app/(leavetracker)/leave_tracker/TrackerSearch"
import getAllTrackers from "@/lib/queries/getAllTrackers"
import TrackerTable from "@/app/(leavetracker)/leave_tracker/TrackerTable"
import getTrackerSearchResults from "@/lib/queries/getTrackersSearchResults"
export const metadata={
    title:"TrackerSearch"
}
export const dynamic = 'force-dynamic';

export default async function TrackerPage({
  searchParams,
}:{
  searchParams:Promise<{[key:string]:string | undefined}>
}){
  const {searchText}=await searchParams;
  if(!searchText){

    const results=await getAllTrackers();
      // Filter where either Received or Approved is false
    const filteredResults = results.filter((tracker) => {
        return (
          tracker.Received_By_Supervisor === "Approved" &&
          tracker.Approved_By_Executive_Team === "Approved"
        );
      });
    

    return (
      <>
        <TrackerSearch/>
          {filteredResults.length?<TrackerTable  data={filteredResults}/>:(
          <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">No leave tracker found; you can add the new leave tracker in the menu.</p>
        )}
        
      </>
    )
  }


  const results=await getTrackerSearchResults(searchText);



  const filteredResults =  results.filter((tracker) => {
    return (
      tracker.Received_By_Supervisor === "Approved" &&
      tracker.Approved_By_Executive_Team === "Approved"
    );
  });

  return(
    <>
      <TrackerSearch/>
      {filteredResults.length?<TrackerTable data={filteredResults}/> :(
        <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">{`No ${searchText} found in leave tracker`}</p>
      )}
      
    </>
  )

}