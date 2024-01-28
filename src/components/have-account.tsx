import Link from "next/link";
import React from "react";

const HaveAccount = () => {
  return (
    <div className="h-96 flex items-center justify-center">
      <div className="p-8 rounded-lg text-center">
        <p className="text-2xl dark:text-white mb-4 text-black">
          You already have an account
        </p>
        <Link href="/" className="text-blue-500 underline">
          Back to home page
        </Link>
      </div>
    </div>
  );
};

export default HaveAccount;
