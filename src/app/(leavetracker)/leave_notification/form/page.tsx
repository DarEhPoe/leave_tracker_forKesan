
export const dynamic = 'force-dynamic';
import NotificationTable from "@/app/(leavetracker)/leave_notification/form/NotificationTable";
import { getNotification } from "@/lib/queries/getNotification";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { notificationId } = await searchParams;


  if (notificationId) {
    return { title: `view notification #${notificationId}` };
  }


}

export default async function TrackerFormPage({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }) {
    
      const { notificationId } = await searchParams;
      const text= await getNotification(Number(notificationId))
  
        return (
          <NotificationTable
          text={text.notification}

          />
        );

  }
  
