"use client";
import React from 'react'
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { File,UsersRound, SettingsIcon,LogOut  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import NavButtonMenu from './NavButtonMenu';
import DropDownMenuYear from '@/components/DropDownMenuYear';
import DropdownViewByName from "@/components/DropDownViewByName";
import { EmployeeSearchResultsType } from '@/lib/queries/getEmployeeSearchResults';
import {ReactNode,useContext } from "react";
import { usePathname } from 'next/navigation'
import { DialogTitle } from "@radix-ui/react-dialog"; 


import DataContext from "@/context/DataContext"
import {
  Home,
  Menu,
  FilePlus,
  Send,
  Bell
  
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";



type Props = {
  employee: EmployeeSearchResultsType;
  uniqueYears: number[]
  children: ReactNode;
  permissions:string[];
};
export default function ResponsiveTable(
  {
    employee,
    uniqueYears,
    children,
    permissions
  }: Props
)  {
  const context=useContext(DataContext);

  const pathname = usePathname();
  const whitelist: string[] = ['/leave_register','/leave_register/form','/leave_noti','/leave_noti/form'];

  const isLeaveRegister = whitelist.includes(pathname);


  if (!context) {
      throw new Error("Home component must be used within a DataProvider");
  }

  const { isOpen,setIsOpen } = context;

  return (
    <div className="flex flex-col h-dvh bg-background text-foreground">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-8 py-8 border-b border-border bg-card sticky top-0 z-50">
        <div className="flex h-8 items-center justify-between w-full">

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="sm:hidden"
                variant="outline"
                size="icon"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="px-4 py-4">
              <SheetHeader>
                <DialogTitle asChild>
                  <h2 className="font-bold text-xl select-none">Menu</h2>
                </DialogTitle>              
              </SheetHeader>

              <div className="space-y-4 mt-4">

                { permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <Link
                        href="/trackers_submit" 
                        onClick={() => setIsOpen(false)} 

                    >
                      <div className='flex gap-3'>
                          <Send className="w-8 h-8" ></Send>
                          <span className="text-sm font-medium select-none">Review Leave Requests</span>

                      </div>
                    </Link>
                  </div>):null
                }

                { permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <Link
                        href="/leave_notification" 
                        onClick={() => setIsOpen(false)} 

                    >
                      <div className='flex gap-3'>
                          <Bell className="w-8 h-8" ></Bell>
                          <span className="text-sm font-medium select-none">View leave notification</span>
                      </div>
                    </Link>
                  </div>):null
                }

                {permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <DropdownViewByName employee={employee}>
                      <span className="text-sm font-medium select-none">View</span>
                    </DropdownViewByName>
                  </div>
                ) : null}

                {permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <NavButtonMenu
                      icon={File}
                      label="Leave Tracker Menu"
                      choice={[
                        { title: "View Leave Tracker", href: "/leave_tracker" },
                        { title: "Add New Leave Tracker", href: "/leave_tracker/form" },
                      ]}
                    >
                      <span className="text-sm font-medium select-none">Tracker</span>
                    </NavButtonMenu>
                  </div>
                ) : null}

                {permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <NavButtonMenu
                      icon={UsersRound}
                      label="Customers Menu"
                      choice={[
                        { title: "Employee list", href: "/employee" },
                        { title: "Add New employee", href: "/employee/form" },
                      ]}
                    >
                      <span className="text-sm font-medium select-none">Staff</span>
                    </NavButtonMenu>
                  </div>
                ) : null}

                {permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <NavButtonMenu
                      icon={SettingsIcon}
                      label="Settting Menu"
                      choice={[
                        { title: "Tracker type", href: "/tracker_type" },
                        { title: "Add New Tracker type", href: "/tracker_type/form" },
                        { title: "Program", href: "/department" },
                        { title: "Add New Program", href: "/department/form" },
                      ]}
                    >
                      <span className="text-sm font-medium select-none">Setting</span>
                    </NavButtonMenu>
                  </div>
                ) : null}

                {permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <DropDownMenuYear uniqueYears={uniqueYears}>
                      <span className="text-sm font-medium select-none">Export</span>
                    </DropDownMenuYear>
                  </div>
                ) : null}

                {
                  (permissions.includes("staff") || permissions.includes("admin") || permissions.includes("manager")) && isLeaveRegister ?(
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <Link 
                      onClick={() => setIsOpen(false)} 
                      href="/leave_register/form" 
                      className="w-full"
                    >
                      <div className="flex items-center">
                        <FilePlus className="w-8 h-8" />
                        <span className="ml-4 text-sm font-medium select-none">Register New Leave</span>
                      </div>
                    </Link>
                  </div>):null
                }

                {
                  (permissions.includes("staff") || permissions.includes("admin") || permissions.includes("manager")) && isLeaveRegister ?(
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <Link 
                      href="/leave_noti/form" 
                      onClick={() => setIsOpen(false)} 

                      className="w-full"
                    >
                      <div className="flex items-center">
                        <Bell className="w-8 h-8"  />
                        <span className="ml-4 text-sm font-medium select-none">Create Leave Noti</span>
                      </div>
                    </Link>
                  </div>):null
                }

                {(permissions.includes("staff") || permissions.includes("admin") || permissions.includes("manager")) && isLeaveRegister ? (
                  <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                    <NavButtonMenu
                      icon={File}
                      label="Leave Tracker Menu"
                      choice={[
                        { title: "View Leave Register", href: "/leave_register" },
                        { title: "View Leave Noti", href: "/leave_noti" },
                      ]}
                    >
                      <span className="text-sm font-medium select-none">View</span>
                    </NavButtonMenu>
                  </div>
                ) : null}

              </div>
            </SheetContent>
          </Sheet>
          <div className='hidden sm:flex'>

            {
              permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister? (
              <Link
                href="/leave_tracker"
                className="inline-flex items-center gap-2 px-4 py-2  text-lg font-bold  hover:opacity-60 transition-all duration-200 select-none"
                title="Go to Leave Tracker Home"
              >
                <Home className="w-12 h-12" />
              </Link>
              ): (
              <Link
                href="/leave_register"
                className="inline-flex items-center gap-2 px-4 py-2  text-lg font-bold  hover:opacity-60 transition-all duration-200 select-none"
                title="Go to Leave Tracker Home"
              >
                <Home className="w-12 h-12" />
              </Link>)
            }

          </div>
          <div className="flex items-center gap-4">
            <ModeToggle/>
            <Button variant="ghost" size="icon" aria-label="LogOut" title='LogOut' className='rounded-full' asChild>
                <LogoutLink>
                  <LogOut></LogOut>
                </LogoutLink>
            </Button>
          </div>
            
        </div>
      </div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden sm:fixed sm:top-[88px] sm:bottom-0 sm:left-0 sm:flex sm:w-64 flex-col justify-between p-4 border-r border-border bg-card z-40 pt-12">
          <div className="space-y-4">


            { permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
              <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <Link
                    href="/trackers_submit" 
                >
                  <div className='flex gap-3'>
                      <Send className="w-8 h-8" ></Send>
                      <span className="text-sm font-medium select-none">Review Leave Requests</span>

                  </div>
                </Link>
              </div>):null
            }

            { permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
              <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <Link
                    href="/leave_notification" 
                >
                  <div className='flex gap-3'>
                      <Bell className="w-8 h-8" ></Bell>
                      <span className="text-sm font-medium select-none">View leave notification</span>
                  </div>
                </Link>
              </div>):null
            }
            

            {permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
              <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <DropdownViewByName employee={employee}>
                  <span className="text-sm font-medium select-none">View</span>
                </DropdownViewByName>
              </div>
            ) : null}

            { permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
              <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <NavButtonMenu
                  icon={File}
                  label="Leave Tracker Menu"
                  choice={[
                    { title: "View Leave Tracker", href: "/leave_tracker" },
                    { title: "Add New Leave Tracker", href: "/leave_tracker/form" },
                  ]}
                >
                  <span className="text-sm font-medium select-none">Tracker</span>
                </NavButtonMenu>
              </div>):null
            }

            {
              permissions.includes("admin") && permissions.includes("manager") &&!isLeaveRegister ? (

                <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                  <NavButtonMenu
                    icon={UsersRound}
                    label="Customers Menu"
                    choice={[
                      { title: "Employee list", href: "/employee" },
                      { title: "Add New employee", href: "/employee/form" },
                    ]}
                  >
                    <span className="text-sm font-medium select-none">Staff</span>
                  </NavButtonMenu>
                </div>
              ):null

            }

            {permissions.includes("admin") && permissions.includes("manager") && !isLeaveRegister ? (
              <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <NavButtonMenu
                  icon={SettingsIcon}
                  label="Setting Menu"
                  choice={[
                    { title: "Tracker type", href: "/tracker_type" },
                    { title: "Add New Tracker type", href: "/tracker_type/form" },
                    { title: "Program", href: "/department" },
                    { title: "Add New Program", href: "/department/form" },
                  ]}
                >
                  <span className="text-sm font-medium select-none">Setting</span>
                </NavButtonMenu>
              </div>
            ) : null}


            {
              permissions.includes("admin") && permissions.includes("manager")&& !isLeaveRegister ? (            
                <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <DropDownMenuYear uniqueYears={uniqueYears}>
                  <span className="text-sm font-medium select-none">Export</span>
                </DropDownMenuYear>
              </div>):null
              
            }
            {
              (permissions.includes("staff") || permissions.includes("admin") || permissions.includes("manager")) && isLeaveRegister ?(
              <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <Link href="/leave_register/form" className="w-full">
                  <div className="flex items-center">
                    <FilePlus className="w-8 h-8" />
                    <span className="ml-4 text-sm font-medium select-none">Register New Leave</span>
                  </div>
                </Link>
              </div>):null
            }


            {
              (permissions.includes("staff") || permissions.includes("admin") || permissions.includes("manager")) && isLeaveRegister ?(
              <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <Link href="/leave_noti/form" className="w-full">
                  <div className="flex items-center">
                    <Bell className="w-8 h-8" />
                    <span className="ml-4 text-sm font-medium select-none">Create Leave Noti</span>
                  </div>
                </Link>
              </div>):null
            }

            {(permissions.includes("staff") || permissions.includes("admin") || permissions.includes("manager")) && isLeaveRegister ? (
              <div className="cursor-pointer flex flex-col items-start w-full px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-md border border-border transition">
                <NavButtonMenu
                  icon={File}
                  label="View Menu"
                  choice={[
                    { title: "View Leave Register", href: "/leave_register" },
                    { title: "View Leave Noti", href: "/leave_noti" },
                  ]}
                >
                  <span className="text-sm font-medium select-none">View</span>
                </NavButtonMenu>
              </div>
            ) : null}

          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:ml-64">
          {children}
        </main>
      </div>

    </div>
  );
}
