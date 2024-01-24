"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const Logout = () => {
  return <LogOut className="mr-2 h-4 w-4" onClick={() => signOut()} />;
};

export default Logout;
