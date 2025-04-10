import { User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import useActiveList from "@/hooks/useActiveList"


interface Props {
    user: User
}

const Avataar = ({ user }: Props) => {
    const { members } = useActiveList()
    const isActive = members?.indexOf(user?.email!) !== -1;
    return (
        <div className="relative pb-3">
            <Avatar>
                <AvatarImage src={user?.image ?? "/user.png"} />
            </Avatar>
            {isActive && (
                <span className="absolute block rounded-full bg-green-500 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
            )}
        </div>
    )
}

export default Avataar