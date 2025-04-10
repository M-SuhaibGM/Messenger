import getCurrentUser from "../../../actions/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { pusherServer } from "@/lib/Pusher";

export async function POST(req) {
    try {
        const currentUser = await getCurrentUser()
        const data = await req.json()
        const { userId, isGroup, members, name,Creater } = data


        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse("Invalid data", { status: 400 })
        }
        if (isGroup) {
           
            const newConversation = await db.conversation.create({
                data: {
                    name,
                    isGroup,
                    Creater,
                    users: {
                        connect: [
                            ...members.map((member) => ({
                                id: member
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            })

            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, "conversation:new", newConversation)
                }
            })
            return NextResponse.json({ message: "group created" }, { status: 200 })
        }

        const existingConversations = await db.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    },
                ]
            }
        })


        const singleConversation = existingConversations[0];

        if (singleConversation) {
            return NextResponse.json(singleConversation)
        }

        const newConversation = await db.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }

        })

        newConversation.users.map((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, "conversation:new", newConversation)
            }
        })
        return NextResponse.json(newConversation)

    } catch (e) {
        console.log(e)
        return new NextResponse("Internal error", { status: 500 })
    }
}