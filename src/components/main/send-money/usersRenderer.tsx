import React from "react";

export type TUserType = {
  id: string;
  email: string;
  avatar?: string;
};

type Props = {
  users: TUserType[] | [];
};

const UsersRenderer = ({ users }: Props) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
};

export default UsersRenderer;
