"use client"
import Avataar from "@/components/ui/Avataar";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client"
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDwawer";
import AvatarGroup from "../../component/AvatarGroup";
import useActiveList from "@/hooks/useActiveList";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    }
    user: User
}
const Header = ({ conversation, user: CurrentUser }: HeaderProps) => {
    const [openDrower, setopenDrower] = useState(false)
    const otherUser = useOtherUser(conversation)
    const { members } = useActiveList()
    const isActive = members?.indexOf(otherUser?.email!) !== -1;
    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }
        return isActive ? 'Active' : 'Offline';
    }, [isActive, conversation])


    return (
        <>
            <ProfileDrawer
                data={conversation}
                isOpen={openDrower}
                isClose={() => setopenDrower(false)}
            />
            <div className="bg-white w-full flex border-b-[1px] sm:pz-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
                <div className="flex gap-3 items-center">
                    <Link href="/conversations" className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer">
                        <HiChevronLeft size={32} />
                    </Link>
                    {conversation.isGroup ? (<AvatarGroup users={conversation.users} />) : (<Avataar user={otherUser} />)}

                    <div className="flex flex-col">
                        <div >
                            {conversation.name || otherUser.name}
                        </div>
                        <div className="text-xs font-light text-neutral-500">
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal size={32} onClick={() => setopenDrower(true)} className="text-sky-500 hover:text-sky-600 transition cursor-pointer" />
            </div>
            {conversation.isGroup && (
                <>
                    <div className="text-xs font-light my-2  text-neutral-500 flex justify-center items-center ">
                        <p className="bg-slate-100 rounded-md py-2 px-1">  <span className="text-sky-500 hover:text-sky-600 transition cursor-pointer"> {conversation.Creater === CurrentUser.name ? <> You </> : <>{conversation.Creater}</>} </span>  created this Group</p>
                    </div>
                    <div >
                        {conversation.users.map((user) => (
                            <>
                                {conversation.Creater !== user.name &&
                                    (<div key={user.id} className="text-xs font-light my-2  text-neutral-500 flex justify-center items-center ">
                                        <p className="bg-slate-100 rounded-md py-2 px-1"> <span className="text-sky-500 hover:text-sky-600 transition cursor-pointer"> {conversation.Creater}</span> added <span className="text-sky-500 hover:text-sky-600 transition cursor-pointer"> {user.name == CurrentUser.name ? <> you </> : <>{user.name}</>}</span></p>
                                    </div>)}
                            </>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default Header 