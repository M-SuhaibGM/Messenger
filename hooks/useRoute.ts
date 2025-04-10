"use client"
import {  usePathname } from "next/navigation";
import { useMemo } from "react";
import {HiChat} from "react-icons/hi"
import {HiArrowLeftOnRectangle,HiUsers} from "react-icons/hi2"
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";




const useRoute = () => {
    const pathname=usePathname();

    const {conversationId}=useConversation();

    const routes=useMemo(() => [
        {
            label:'Chat',
            href:'/conversations',
            icons:HiChat,
            active:pathname==='/conversations' || !!conversationId
        },{

            label:'Users',
            href:'/users',
            icons:HiUsers,
            active:pathname==='/users'
        }, {
            label:'Logout',
            href:'#',
            onClick:() => signOut(),
            icons:HiArrowLeftOnRectangle
        }
    ],[pathname,conversationId])
  
    return routes
}
export default useRoute



