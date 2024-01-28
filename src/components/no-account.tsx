import Link from "next/link";
import React from "react";

const NoAccount = () => {
  return (
    <div className="h-96 flex items-center justify-center">
      <div className="p-8 rounded-lg text-center">
        <p className="text-2xl dark:text-white mb-4 text-black">
          You do not have an account
        </p>
        <Link href="/create-account" className="text-blue-500 underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default NoAccount;
