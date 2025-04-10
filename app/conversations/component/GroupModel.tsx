"use client"
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Props {
    users: User[];
    setOpen: React.Dispatch<React.SetStateAction<any>>;
    user: User
}

const GroupModel = ({ users, setOpen, user }: Props) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [groupName, setGroupName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    const toggleUserSelection = (user: User) => {
        setSelectedUsers((prev) =>
            prev.some((u) => u.id === user.id)
                ? prev.filter((u) => u.id !== user.id)
                : [...prev, user]
        );
    };

    const removeUser = (userId: string) => {
        setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!groupName.trim()) {
            setError("Group name is required");
            return;
        }

        if (selectedUsers.length < 1) {
            setError("Please select at least one user");
            return;
        }

        try {
            setIsLoading(true);
            const group = await axios.post("/api/conversations", {
                name: groupName,
                isGroup: true,
                Creater: user.name,
                members: selectedUsers.map((user) => user.id),
            });
            if (group.data.message === "group created") {
                toast.success(`"${groupName}" Group created`)
                setOpen(false);
            }
        }
        catch (err) {
            toast.error("Failed to create group. Please try again.");
            console.error("Group creation error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Create Group</AlertDialogTitle>
                <AlertDialogDescription>
                    Add friends to your group and start chatting with them
                </AlertDialogDescription>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <Input
                            placeholder="Group name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>

                    <div className="border rounded-md p-2 min-h-12">
                        {selectedUsers.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedUsers.map((user) => (
                                    <Badge
                                        key={user.id}
                                        variant="outline"
                                        className="flex items-center gap-1"
                                    >
                                        {user.name}
                                        <button
                                            type="button"
                                            onClick={() => removeUser(user.id)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No users selected yet
                            </p>
                        )}
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        <h3 className="text-sm font-medium mb-2">Available Users</h3>
                        <div className="space-y-2">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className={`p-2 rounded-md border cursor-pointer ${selectedUsers.some((u) => u.id === user.id)
                                        ? "bg-gray-300"
                                        : "hover:bg-muted"
                                        }`}
                                    onClick={() => toggleUserSelection(user)}
                                >
                                    {user.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild></AlertDialogAction>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Group"
                        )}
                    </Button>

                </AlertDialogFooter>
            </form>
        </AlertDialogContent>
    );
};

export default GroupModel;