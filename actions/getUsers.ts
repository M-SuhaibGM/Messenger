import { db } from "@/lib/db";
import getSession from "./getSession";

const getUser = async () => {
    const session = await getSession()
    if (!session?.user?.email) {
        return null
    }

    try {
        const users = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                NOT: {
                    email: session.user.email
                }
            }
        })
        return users
    } catch (error: any) {
        return []
    }

}
export default getUser