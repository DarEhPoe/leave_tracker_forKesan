export const metadata = {
  title: "DepartmentSearch",
};


export const dynamic = "force-dynamic"; 


import { getAllDepartment } from "@/lib/queries/getAllDepartment";
import DepartmentTable from "@/app/(leavetracker)/department/DepartmentTable";
export default async function TrackerPage() {




  const results = await getAllDepartment();
  return (
    <>
      {results.length ? (
        <DepartmentTable data={results} />
      ) : (
        <p className="mt-4 px-4 py-2 text-sm text-black/90 dark:text-white/70 bg-black/40 dark:bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">
          No department found, add new department in the menu
        </p>
      )}
    </>
  );
}
