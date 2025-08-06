'use client';

import { useState, useEffect ,ReactNode,useContext} from 'react';
import DataContext from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import { EmployeeSearchResultsType } from '@/lib/queries/getEmployeeSearchResults';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Search, LoaderCircle } from 'lucide-react';

type Props = {
  children:ReactNode,
  employee: EmployeeSearchResultsType;
};

export default function DropdownViewByName({ employee ,children}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const context=useContext(DataContext);

  if (!context) {
      throw new Error("Home component must be used within a DataProvider");
  }

  const { setIsOpen } = context;


  // ✅ Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewSummary = async (employeeId: number) => {
    try {
      setLoading(true);
      router.push(`/summary?employeeId=${employeeId}`);
    } catch (error) {
      console.error('Failed to view summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex justify-start items-center gap-3 ' >
            <Search className="w-8 h-8" />
            {children}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>View Tracker summary by Person</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {employee.length > 0 ? (
            employee.map((data) => (
              <DropdownMenuItem
                key={data.id}
                onClick={() => {
                  handleViewSummary(data.id);
                  setIsOpen(false);
                }}
                
              >
                {data.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              No employee to view tracker summary
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {loading && (
        <div className="fixed inset-0 z-50 bg-background/80">
          <div className="w-full h-dvh grid place-content-center">
            <LoaderCircle className="h-48 w-48 animate-spin text-foreground/20" />
          </div>
        </div>
      )}
    </>
  );
}
