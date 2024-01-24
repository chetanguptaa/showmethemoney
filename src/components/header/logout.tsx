"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const Logout = () => {
  return (
    <button
      onClick={() => signOut()}
      className="flex justify-between items-center"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </button>
  );
};

export default Logout;
