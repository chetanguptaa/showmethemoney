import React from "react";
import UserRenderer from "./userRenderer";

export type TUserType = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

type Props = {
  users: TUserType[] | [];
  URLType: "request" | "send";
};

const UsersRenderer = ({ users, URLType }: Props) => {
  return (
    <div className="space-y-8">
      {users.map((user) => (
        <UserRenderer
          key={user.id}
          id={user.id}
          email={user.email}
          avatar={user.avatar}
          name={user.name}
          URLType={URLType}
        />
      ))}
    </div>
  );
};

export default UsersRenderer;
