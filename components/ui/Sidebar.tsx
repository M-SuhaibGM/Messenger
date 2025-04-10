import getCurrentUser from "@/actions/getCurrentUser"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"
const Sidebar = async ({ children }: { children: React.ReactNode }) => {

    const CurrentUser = await getCurrentUser()
    return (
        <div className="h-full">
            {CurrentUser && <DesktopSidebar currentuser={CurrentUser} />}
            <MobileSidebar />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}

export default Sidebar 