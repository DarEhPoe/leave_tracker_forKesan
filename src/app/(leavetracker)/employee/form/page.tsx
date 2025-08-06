import { getEmployee } from "@/lib/queries/getEmployee";
import BackButton from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import EmployeeForm from "@/app/(leavetracker)/employee/form/EmployeeForm";
import { getAllDepartment } from "@/lib/queries/getAllDepartment";
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { employeeId } = await searchParams;
  if (!employeeId) return { title: "New Employee" };
  return { title: `Edit Employee #${employeeId}` };
}

export default async function EmployeeFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { employeeId } = await searchParams;
    const department = await getAllDepartment();
    const departmentData = department.map((data) => ({
      id: data.id,
      description: data.name,
    }));

    if (employeeId) {
      const employee = await getEmployee(parseInt(employeeId));
      if (!employee) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Employee ID #{employeeId} not found
            </h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }

      return (
        <EmployeeForm
          key={employeeId}
          employee={employee}
          departmentType={departmentData}
        />
      );
    }

    return <EmployeeForm key="new" departmentType={departmentData} />;
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }

  return null;
}
