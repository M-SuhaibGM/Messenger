import { NextResponse } from "next/server"
import getCurrentUser from "../../../actions/getCurrentUser"
import { db } from "../../../lib/db";
import { pusherServer } from "../../../lib/Pusher";


export async function POST(req) {
    try {
        const data = await req.json()
        const CurrentUser = await getCurrentUser();

        if (!CurrentUser?.id || !CurrentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const {
            message,
            image,
            conversationId
        } = data;
        const newMessage = await db.message.create({
            data: {
                body: message,
                image: image,
                Conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: CurrentUser.id
                    }
                },
                seen: {
                    connect: {
                        id: CurrentUser.id
                    }
                }
            }, include: {
                seen: true,
                sender: true
            }
        });


        const updatedConversation = await db.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        })
        await pusherServer.trigger(conversationId, 'messages:new', newMessage)
        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email, 'conversation:update', {
                id: conversationId,
                message: [lastMessage]
            })
        })

        return NextResponse.json(newMessage)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}