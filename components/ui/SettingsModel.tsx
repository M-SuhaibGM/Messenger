import { User } from "@prisma/client"
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Avataar from "./Avataar"
import { useRouter } from "next/navigation"

interface Props {
    currentUser: User
}

const SettingsModal = ({ currentUser }: Props) => {
    const [name, setName] = useState(currentUser.name || "")
    const [email, setEmail] = useState(currentUser.email || "")
    const [image, setImage] = useState(currentUser.image || "")
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    setImage(event.target.result as string)
                }
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }
const router = useRouter()
    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("email", email)
            if (file) {
                formData.append("image", file)
            }

            const response = await axios.patch("/api/user", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            toast.success("Profile updated successfully!")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Profile Settings</AlertDialogTitle>
                <AlertDialogDescription>
                    Update your profile information
                </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-2">
                    <label htmlFor="profile-picture" className="cursor-pointer">
                        <Avataar user={currentUser} />
                    </label>
                    <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <p className="text-sm text-muted-foreground">
                        Click to change profile picture
                    </p>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Save Changes"
                    )}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}

export default SettingsModal