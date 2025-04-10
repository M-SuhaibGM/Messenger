
import Sidebar from "@/components/ui/Sidebar";
import ConversationList from "./component/ConversationList";
import getConversation from "@/actions/getConversation";
import getUser from "@/actions/getUsers";
import getCurrentUser from "@/actions/getCurrentUser";
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    const conversation = await getConversation()
    const users = await getUser()
    const currentUser = await getCurrentUser()

    return (
        <Sidebar>
            <div className="h-full">
                {currentUser && (
                    <ConversationList initialItems={conversation} currentUser={currentUser} user={users ?? []} />
                )}
                {children}
            </div>
        </Sidebar>
    );
}