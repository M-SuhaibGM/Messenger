import getConversationById from "@/actions/getConversationById"
import getMessages from "@/actions/getMessages";
import EmpityState from "@/components/ui/EmpityState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import getCurrentUser from "@/actions/getCurrentUser";

interface Props {
    conversationId: string
}
const page = async ({ params }: { params: Props }) => {
    const conversation = await getConversationById(params.conversationId);
    const messages = await getMessages(params.conversationId);
    const user = await getCurrentUser()


    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full">
                    <EmpityState />
                </div>
            </div>
        )
    }
    return (
        <div
            className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                {user && <Header conversation={conversation} user={user} />}
                <Body initialMessages={messages} />
                <Form />
            </div>
        </div>
    )
}

export default page