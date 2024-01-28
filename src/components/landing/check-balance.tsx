"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { MoveRight, Terminal } from "lucide-react";
import { checkAccountBalanceAction } from "@/app/actions/check-account-balance";
import { toast } from "../ui/use-toast";

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
    <Alert
      className="border-none hover:cursor-pointer hover:scale-110 transition-transform"
      onClick={checkAccountBalance}
    >
      <Terminal className="h-4 w-4" />
      <AlertTitle>Check Balance</AlertTitle>
      <AlertDescription className="flex justify-between">
        <p>You can check balance in your account</p>
        <MoveRight className="hover:cursor-pointer hover:scale-110 transition-transform" />
      </AlertDescription>
    </Alert>
  );
};

export default CheckBalance;
