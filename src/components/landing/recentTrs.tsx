import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { getUserSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

const RecentTransactions = async () => {
  const { id } = await getUserSession();
  const transactions = await prisma.account.findFirst({
    where: {
      userId: id,
    },
    select: {
      transactionsInitiated: true,
      transactionsReceived: true,
    },
  });
  const allTransactions = [
    ...(transactions?.transactionsInitiated || []),
    ...(transactions?.transactionsReceived || []),
  ];
  return (
    <ScrollArea className=" h-24 w-full border-t">
      <div className="p-4">
        <h4 className="mb-8 text-sm font-medium leading-none">
          Recent Transactions
        </h4>
        {!id && <p>First create an account</p>}
        {/* {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))} */}
      </div>
    </ScrollArea>
  );
};

export default RecentTransactions;
