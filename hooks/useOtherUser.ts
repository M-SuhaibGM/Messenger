"use client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types/index";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
    const session = useSession();
    const otherUser = useMemo(() => {

        const otherUser = conversation.users.filter((user) => user.email !== session.data?.user?.email)

        return otherUser[0];
    }, [session?.data?.user?.email, conversation.users])


    return otherUser;
}
export default useOtherUser