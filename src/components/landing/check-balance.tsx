"use client";

import React from "react";
import { checkAccountBalanceAction } from "@/app/actions/check-account-balance";
import { toast } from "../ui/use-toast";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsTitle,
} from "../ui/glowing-stars";
import { rs } from "./glowing-card";

const CheckBalance = () => {
  const checkAccountBalance = async () => {
    const res = await checkAccountBalanceAction();
    if (res.status === "failure") {
      toast({
        title: "Failure",
        description: res.error,
      });
    } else {
      toast({
        title: "Your Balance",
        description: `You have $${res.balance}`,
      });
    }
  };
  return (
    <div className={rs.className}>
      <div className="flex flex-row sm:flex-col py-4 items-center justify-center antialiased">
        <GlowingStarsBackgroundCard>
          <GlowingStarsTitle
            className="text-center underline underline-offset-4 group-hover:underline-offset-8 transition-all duration-300 ease-in-out hover:cursor-pointer"
            checkBalance={checkAccountBalance}
          >
            Check Balance
          </GlowingStarsTitle>
        </GlowingStarsBackgroundCard>
      </div>
    </div>
  );
};

export default CheckBalance;
