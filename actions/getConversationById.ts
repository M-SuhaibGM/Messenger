import { db } from "@/lib/db";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
    try {
        const CurrentUser = await getCurrentUser()
        if (!CurrentUser?.email) {
            return null;
        }
        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true,
            }
        })

        return conversation

    } catch (error: any) {
        return null
    }
}
export default getConversationById