import useOtherUser from "@/hooks/useOtherUser"
import { Conversation, User } from "@prisma/client"
import { format } from "date-fns"
import { Fragment, useMemo } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { IoClose, IoTrash } from 'react-icons/io5'
import Avaatar from "@/components/ui/Avataar"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import useConversation from "@/hooks/useConversation"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import AvatarGroup from "../../component/AvatarGroup"
import useActiveList from "@/hooks/useActiveList"


interface Props {
    data: Conversation & {
        users: User[]
    }
    isClose: () => void
    isOpen: boolean
}

const ProfileDrawer = async ({ data, isClose, isOpen }: Props) => {
    const [loading, setloading] = useState(false)
    const otherUser = useOtherUser(data)
    const { conversationId } = useConversation()
    const { members } = useActiveList()
    const isActive = members?.indexOf(otherUser?.email!) !== -1;
   
    const joinedData = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP') // Changed 'pp' to 'PP'
    }, [otherUser.createdAt])

    const title = useMemo(() => {
        return data.name || otherUser.name
    }, [data.name, otherUser.name])

    const statusText = useMemo(() => {
        if (data.isGroup) {
            return `${data.users.length} members`
        }
        return isActive ? 'Active' : 'Offline';
    }, [data,isActive])

    const joinedDate = useMemo(() => {
        return format(new Date(data.createdAt), 'PP') // Changed 'pp' to 'PP'
    }, [data.createdAt])

    const onDelete = () => {
        setloading(true)
        axios.delete(`/api/conversations/${conversationId}`)
            .then(() => {
                isClose()
                toast.success("Chat Deleted")
            })
            .catch((error: any) => {
                toast.error('Error deleting conversation')
            })
            .finally(() => setloading(false));

    }
    return (
        <Transition.Root show={isOpen} as={Fragment}>

            <Dialog as='div' className="relative z-50" onClose={isClose}>
                <AlertDialog>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-end">
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            onClick={isClose}
                                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <IoClose className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="mb-2">
                                                        {data.isGroup ? (<AvatarGroup users={data.users} />) : (<Avaatar user={otherUser} />)}
                                                    </div>
                                                    <div>{title}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {statusText}
                                                    </div>
                                                </div>
                                                <div className="flex gap-10 my-8 justify-center">
                                                    <div className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                                                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                                                            <AlertDialogTrigger>
                                                                <IoTrash size={20} />
                                                            </AlertDialogTrigger>
                                                        </div>
                                                        <div className="text-sm font-light text-neutral-600">Delete</div>
                                                    </div>
                                                </div>
                                                <div className="w-full pt-5">
                                                    <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                        {data.isGroup && (
                                                            <>
                                                                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                                                    <dt className="text-sm font-medium text-gray-500">
                                                                        Members
                                                                    </dt>
                                                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                                        {data.users.map((user) => user.name).join(" ,  ")}
                                                                    </dd>
                                                                </div>
                                                                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                                                    <dt className="text-sm font-medium text-gray-500">
                                                                        Email
                                                                    </dt>
                                                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                                        {data.users.map((user) => user.email).join(" ,  ")}
                                                                    </dd>
                                                                </div>
                                                                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                                                    <dt className="text-sm font-medium text-gray-500">
                                                                        Created By
                                                                    </dt>
                                                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                                        {data.Creater} at<div className="text-xs font-light text-gray-500"> {joinedDate}</div>
                                                                    </dd>
                                                                </div>
                                                            </>
                                                        )}
                                                        {!data.isGroup && (
                                                            <>
                                                                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                                                    <dt className="text-sm font-medium text-gray-500">
                                                                        Email
                                                                    </dt>
                                                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                                        {otherUser.email}
                                                                    </dd>
                                                                </div>
                                                                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                                                                    <dt className="text-sm font-medium text-gray-500">
                                                                        Joined
                                                                    </dt>
                                                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                                        <time dateTime={joinedData}>
                                                                            {joinedData}
                                                                        </time>
                                                                    </dd>
                                                                </div>
                                                            </>
                                                        )}
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button disabled={loading} onClick={onDelete} variant='outline' className="bg-red-500 text-white hover:bg-red-600">Delete  {loading && <Loader2 className="animate-spin h-3 w-3" />}</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Dialog>
        </Transition.Root>
    )
}

export default ProfileDrawer