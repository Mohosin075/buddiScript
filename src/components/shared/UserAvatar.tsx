import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

const UserAvatar: React.FC<IProps> = ({ src, alt, fallback, className }) => {
  return (
    <Avatar className={className}>
      {src ? (
        <AvatarImage src={src} alt={alt} />
      ) : (
        <AvatarFallback>{fallback?.slice(0, 2) ?? "U"}</AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
