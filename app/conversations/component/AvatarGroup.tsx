"use client"
import { User } from "@prisma/client"
import Image from "next/image"

interface Props {
    users: User[]
}

const AvatarGroup = ({ users }: Props) => {
    const sliceUser = users?.slice(0, 3)
    const positionMap = {
        0: "left-[14px] top-[2px] ",
        1: "bottom-[4px] left-[4px]",
        2: "right-[4px] bottom-[4px]"
    }
    return (
        <div className="relative h-12 w-12  rounded-full bg-gray-300">
            {sliceUser?.map((user, index) => (
                <div key={user.id} className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${positionMap[index as keyof typeof positionMap]} `}>
                    <Image fill src={user.image || "/user.png"} className="border rounded-full  " alt="Avatar" />
                </div>
            ))}
        </div>
    )
}

export default AvatarGroup