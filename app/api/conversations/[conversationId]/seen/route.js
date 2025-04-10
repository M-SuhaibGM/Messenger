import { NextResponse } from "next/server"
import getCurrentUser from "../../../../../actions/getCurrentUser"
import { db } from "../../../../../lib/db";
import { pusherServer } from "@/lib/Pusher";




export async function POST(request, { params }) {
    const { conversationId } = await params
    try {
        const user = await getCurrentUser();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        })
        if (!conversation) {
            return new NextResponse("Invalid ID", { status: 400 })
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1]

        if (!lastMessage) {
            return NextResponse.json(conversation)
        }

        const updatedMessage = await db.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })


        await pusherServer.trigger(user.email, "conversation:update", {
            id: conversationId,
            messages: [updatedMessage],
        });
        if (lastMessage.seenIds.indexOf(user.id) === -1) {
            return NextResponse.json(conversation)
        }
        await pusherServer.trigger(conversationId, "message:update",updatedMessage) 
           

        return NextResponse.json(updatedMessage)
    } catch (e) {
        console.log(e)
        return new NextResponse("Internal Error", { status: 500 })
    }
}