import { LucideIcon } from "lucide-react";

import {Button} from "@/components/ui/button";

type Props={
    icon?:LucideIcon,
    label:string,
    href?:string,
}

export default function NavButton({
    label,
}:Props) {
  return (
    <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        title={label}
        className="rounded-full"
        asChild
    >

    </Button>
  )
}
