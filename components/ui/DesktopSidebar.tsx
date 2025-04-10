"use client"
import DisktopItem from "./DisktopItem"
import useRoute from "@/hooks/useRoute"
import { User } from "@prisma/client";
import { useState } from "react";
import Avataar from "./Avataar";
import SettingsModel from "./SettingsModel";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
interface Props {
  currentuser: User;
}
const DesktopSidebar = ({ currentuser }: Props) => {
  const routes = useRoute();
  const [isOpen, setisOpen] = useState(false)

  return (
    <>
      <AlertDialog>
        <SettingsModel
          currentUser={currentuser}
        />
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-20
    lg:left-0 lg:flex-col
    lg:overflow-y-auto lg:bg-white lg:border-r-[1px]
    justify-between">
          <nav className="flex mt-4 justify-between flex-col">
            <ul role="list" className="flex flex-col items-center space-y-1">
              {routes.map((item) => (
                <DisktopItem key={item.href} href={item.href} label={item.label} icon={item.icons} active={item.active} onClick={item.onClick} />
              ))}
            </ul>
          </nav>
          <nav className="mt-4 flex flex-col justify-between items-center">
            <div onClick={() => setisOpen(true)}>
              <AlertDialogTrigger >
                <Avataar user={currentuser} />
              </AlertDialogTrigger>
            </div>
          </nav>
        </div>
      </AlertDialog>
    </>
  )
}

export default DesktopSidebar