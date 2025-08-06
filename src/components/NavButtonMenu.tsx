import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {ReactNode,useContext} from "react"
import DataContext from "@/context/DataContext";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,

}from "@/components/ui/dropdown-menu"

type Props={
    icon:LucideIcon,
    children:ReactNode,
    label:string,
    choice:{
        title:string,
        href:string
    }[]
}


export default function NavButtonMenu({
    icon:Icon,
    choice,
    children
}:Props) {
    const context=useContext(DataContext);

    if (!context) {
        throw new Error("Home component must be used within a DataProvider");
    }
  
    const { setIsOpen } = context;
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <div className='flex justify-start items-center gap-3' >
            <Icon className="w-8 h-8" />
            {children}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {
                choice.map(choice=>(
                    <DropdownMenuItem key={choice.title} asChild 
                        onClick={()=>setIsOpen(false)}
                    >
                        <Link href={choice.href}>
                            {choice.title}
                        </Link>

                    </DropdownMenuItem>
                ))
            }
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
