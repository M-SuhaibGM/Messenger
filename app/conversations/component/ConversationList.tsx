"use client"
import useConversation from "@/hooks/useConversation";
import { FullConversationType } from "@/types/index";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md"
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import {
    AlertDialog,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import GroupModel from "./GroupModel";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/Pusher";
import { find, update } from "lodash";
interface Props {
    initialItems: FullConversationType[];
    user: User[];
    currentUser:User
}

const ConversationList = ({ initialItems, user,currentUser }: Props) => {
    const session = useSession()
    const [items, setitems] = useState(initialItems);
    const [open, setopen] = useState(false)
    const router = useRouter();

    const { conversationId, isOpen } = useConversation()
    const Pusherkey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email])


    useEffect(() => {
        if (!Pusherkey) {
            return;
        }
        pusherClient.subscribe(Pusherkey);
        const newhandler = (conversation: FullConversationType) => {
            setitems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }
                return [conversation, ...current]
            })

        }
        const updatehandler = (conversation: FullConversationType) => {
            setitems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    }
                }
                return currentConversation;
            }))
        }
        const removehandler = (conversation: FullConversationType) => {
            setitems((current) => {
                return current.filter((currentConversation) => currentConversation.id !== conversation.id)
            })
            if (conversationId === conversation.id) {
                router.push('/conversations')
            }
        }
        pusherClient.bind('conversation:new', newhandler)
        pusherClient.bind('conversation:update', updatehandler)
        pusherClient.bind('conversation:remove', removehandler)
        
        return () => {
            pusherClient.unsubscribe(Pusherkey);
            pusherClient.unbind('conversation:new', newhandler)
            pusherClient.unbind('conversation:update', updatehandler)
            pusherClient.unbind('conversation:remove', removehandler)
        }
    }, [Pusherkey, conversationId, router])

    return (
        <>
            <AlertDialog open={open} onOpenChange={setopen} >
                <GroupModel users={user} setOpen={setopen} user={currentUser} />
                <aside className={clsx("fixed inset-y-0 pb-20 lg:pb-8 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200  ", isOpen ? "hidden" : "block w-full left-0")}>
                    <div className="px-5">
                        <div className="flex justify-between mb-4 items-center">
                            <div className="text-2xl font-bold text-neutral-800 ">
                                Messages
                            </div>
                            <AlertDialogTrigger>
                                <div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition" >
                                    <MdOutlineGroupAdd size={20} />
                                </div>
                            </AlertDialogTrigger>
                        </div>
                        {items.map((item) => (
                            <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
                        ))}
                    </div>
                </aside>
            </AlertDialog >
        </>
    )
}

export default ConversationList