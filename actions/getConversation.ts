import { db } from "@/lib/db";
import getCurrentUser from "./getCurrentUser";


const getConversation = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser?.id) {
        return []
    }
    try {
        const conversation = await db.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc"
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,
                
                messages: {
                    include: {
                        seen: true,
                        sender: true,
                    }
                }
            }
        })

        return conversation

    } catch (error: any) {
        return []
    }

}

export default getConversation