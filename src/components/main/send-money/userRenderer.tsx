import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type Props = {
  name?: string;
  email: string;
  avatar?: string;
};

const UserRenderer = ({ email, avatar, name }: Props) => {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatar} alt="Avatar" />
        <AvatarFallback>{email[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        {name && <p className="text-sm font-medium leading-none">{name}</p>}
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <Button className="ml-auto font-medium" variant="default">
        Send
      </Button>
    </div>
  );
};

export default UserRenderer;
