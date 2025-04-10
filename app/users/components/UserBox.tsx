"use client"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import axios from 'axios'
import Avataar from "@/components/ui/Avataar"
import LoadingModel from "@/components/ui/LoadingModel"
interface Props {
    data: User
}

const UserBox = ({ data }: Props) => {
    const router = useRouter();
    const [isLoading, setisLoading] = useState(false)

    const handleClick = useCallback(() => {
        setisLoading(true)
        axios.post('api/conversations', { userId: data.id })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`)
            })
            .finally(() => setisLoading(false))
    }, [data.id, router])
    return (
        <>
            {isLoading && <LoadingModel />}

            <div onClick={handleClick}
                className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer">
                <Avataar user={data} />
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-900">
                                {data.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default UserBox