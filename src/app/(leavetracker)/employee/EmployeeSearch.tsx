import SearchButton from "@/components/SearchButton"
import { Input } from "@/components/ui/input"
export default function EmployeeSearch(){
    return(
        <form 
            action="/employee"
            className="flex gap-2 items-center"
            
        >
            <Input
                name="searchText"
                type="text"
                placeholder="Serach Employee"
                className="w-full"
                autoFocus
                
            >
            </Input>
            <SearchButton/>
         


        </form>
    )
}