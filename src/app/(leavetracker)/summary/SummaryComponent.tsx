import type { TrackerSearchResultsType } from "@/lib/queries/getTrackersSearchResults";
import type { TrackerTypeSearchResultsType } from "@/lib/queries/getTrackerTypeSearchResults";
import { selectEmployeeSchemaType } from "@/zod-schemas/employee";
type Props = {
  tracker: TrackerSearchResultsType;
  trackertype: TrackerTypeSearchResultsType;
  employee:selectEmployeeSchemaType;
};

export default function SummaryComponent({ tracker, trackertype,employee }: Props) {

  const formatLeave = (days: number, hours: number) => {
    const wholeHours = Math.floor(hours);
    const leaveParts = [];

    if (days > 0) leaveParts.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (wholeHours > 0) leaveParts.push(`${wholeHours} ${wholeHours === 1 ? "hour" : "hours"}`);

    return leaveParts.length ? leaveParts.join(" ") : "-";
  };

  return (
    <>
      {/* Summary Table */}
      <div className="p-6 bg-white dark:bg-black/10 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">{`Summary Overview of ${employee.name}`}</h2>

        {/* ✅ Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-white/10">
                <th className="border px-4 py-2">Tracker Type</th>
                <th className="border px-4 py-2">Tracker Count</th>
                <th className="border px-4 py-2">Total Leave Duration</th>
              </tr>
            </thead>
            <tbody>
              {trackertype.map((type) => {
                const filtered = tracker.filter((t) => t.type === type.name);
                const totalRecords = filtered.length;
                const totalDays = filtered.reduce((sum, item) => {
                  const dayStr = item.Number_of_Days ?? "";
                  const match = dayStr.match(/\d+(\.\d+)?/);
                  const days = match ? parseFloat(match[0]) : 0;
                  return sum + days;
                }, 0);

                const totalHours = filtered.reduce((sum, item) => {
                  if (!item.Total_time) return sum;
                  const [hoursStr, minutesStr] = item.Total_time.split(":");
                  const hours = parseInt(hoursStr, 10) || 0;
                  const minutes = parseInt(minutesStr, 10) || 0;
                  return sum + hours + minutes / 60;
                }, 0);

                return (
                  <tr key={type.id}>
                    <td className="border px-4 py-2">{type.name}</td>
                    <td className="border px-4 py-2">{totalRecords > 0 ? totalRecords : "-"}</td>
                    <td className="border px-4 py-2">
                      {formatLeave(totalDays, totalHours)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}
