
import getUser from "@/actions/getUsers";
import Sidebar from "@/components/ui/Sidebar";
import UserList from "./components/UserList";
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    const users = await getUser()
    
    return (
        <Sidebar>
            <div className="h-full">
                {users && <UserList users={users} />}
                {children}
            </div>
        </Sidebar>
    );
}