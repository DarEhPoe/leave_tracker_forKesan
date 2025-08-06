import Form from "next/form"
import {Input} from "@/components/ui/input"
import SearchButton from "@/components/SearchButton"
export default function TrackerSearch(){
    return(
        <Form
            action="/leave_tracker"
            className="flex gap-2 items-center"
        >
            <Input 
                name="searchText"
                type="text"
                placeholder="Search Trackers"
                className="w-full"
                autoFocus
            >
            </Input>
            <SearchButton/>
        </Form>
    )
}