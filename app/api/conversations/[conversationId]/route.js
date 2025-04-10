import { NextResponse } from "next/server"
import getCurrentUser from "../../../../actions/getCurrentUser"
import { db } from "../../../../lib/db";
import { pusherServer } from "../../../../lib/Pusher";




export async function DELETE(request, { params }) {
    const { conversationId } = await params
    try {
        const user = await getCurrentUser();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const existingConversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            }, include: {
                users: true
            }
        })


        if (!existingConversation) {
            return new NextResponse("Conversation not found", { status: 404 })
        }
        const deletedConversation = await db.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [user.id]
                }
            }
        })
        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, "conversation:remove", existingConversation)
            }
        })
        return NextResponse.json(deletedConversation)

    } catch (e) {
        console.log(e)
        return new NextResponse("Unauthorized", { status: 401 })
    }
}