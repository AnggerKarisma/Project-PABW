import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
}

const UserAvatar = ({ name, avatarUrl }: UserAvatarProps) => {
  // Function to get initials from name
  const getInitials = (str: string) => {
    if (!str) return "U";
    const names = str.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        {avatarUrl && <AvatarImage src={avatarUrl} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold text-lg">Welcome,</h2>
        <p className="-mt-1">{name || "User"}</p>
      </div>
    </div>
  );
};

export default UserAvatar;
