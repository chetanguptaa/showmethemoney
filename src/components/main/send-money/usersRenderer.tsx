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
};

const UsersRenderer = ({ users }: Props) => {
  return (
    <div className="space-y-8">
      {users.map((user) => (
        <UserRenderer
          key={user.id}
          id={user.id}
          email={user.email}
          avatar={user.avatar}
          name={user.name}
        />
      ))}
    </div>
  );
};

export default UsersRenderer;
