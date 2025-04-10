"use client"
import useConversation from "@/hooks/useConversation"
import EmpityState from "@/components/ui/EmpityState"
import clsx from "clsx";

const page = () => {
    const { isOpen } = useConversation();
    return (
        <div className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}>
            <EmpityState />
        </div>
    )
}

export default page