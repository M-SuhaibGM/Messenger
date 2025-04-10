"use client"
import MobileItem from "./MobileItem";
import useConversation from "@/hooks/useConversation";
import useRoute from "@/hooks/useRoute"

const MobileSidebar = () => {
    const routes=useRoute();
    const {isOpen}=useConversation();

    if(isOpen) {
        return null
    }
  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden" >
        {routes.map((item) => (
            <MobileItem key={item.href} href={item.href} label={item.label} icon={item.icons} active={item.active} onClick={item.onClick} />
          ))}
    </div>
  )
}

export default MobileSidebar