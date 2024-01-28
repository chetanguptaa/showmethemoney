import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { memo, useMemo } from "react";

type Props = {
  email: string;
  name?: string;
  avatar?: string;
};

const UserProfile = memo(function UserProfile({ avatar, email, name }: Props) {
  const AvatarElement = useMemo(
    () => (
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatar} alt="Avatar" />
        <AvatarFallback>{email[0]}</AvatarFallback>
      </Avatar>
    ),
    [avatar, email]
  );
  const NameAndEmailElements = useMemo(
    () => (
      <div className="ml-4 space-y-1">
        {name && (
          <p className="text-sm font-medium leading-none break-all">{name}</p>
        )}
        <p className="text-sm text-muted-foreground break-all">{email}</p>
      </div>
    ),
    [name, email]
  );
  return (
    <>
      {AvatarElement}
      {NameAndEmailElements}
    </>
  );
});

export default UserProfile;
