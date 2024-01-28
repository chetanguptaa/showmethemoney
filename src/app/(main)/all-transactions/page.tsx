import { getUserSession } from "@/app/lib/auth";
import React from "react";
import prisma from "@/app/lib/prisma";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfile from "@/components/main/userProfile";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {};

const AllTransactionsPage = async (props: Props) => {
  const { id } = await getUserSession();
  const account = await prisma.account.findFirst({
    where: {
      userId: id,
    },
  });
  if (!account) {
    return <div>You do not have an account</div>;
  }
  const transactions = await prisma.account.findFirst({
    where: {
      userId: id,
    },
    select: {
      transactionsInitiated: {
        select: {
          receiver: {
            select: {
              user: {
                select: {
                  email: true,
                  avatar: true,
                  name: true,
                },
              },
            },
          },
          amount: true,
          message: true,
          createdAt: true,
          id: true,
        },
      },
      transactionsReceived: {
        select: {
          sender: {
            select: {
              user: {
                select: {
                  email: true,
                  avatar: true,
                  name: true,
                },
              },
            },
          },
          amount: true,
          message: true,
          createdAt: true,
          id: true,
        },
      },
    },
  });
  const transactionsInitiated = transactions?.transactionsInitiated || [];
  const transactionsReceived = transactions?.transactionsReceived || [];

  type TTransaction = {
    id: string;
    createdAt: Date;
    amount: number;
    message: string;
    email: string;
    name: string | null | undefined;
    avatar: string | null | undefined;
    gettingMoney: boolean;
  };

  let allTransactions: TTransaction[] = [];

  for (let i = 0; i < transactionsInitiated.length; i++) {
    const transaction: TTransaction = {
      id: transactionsInitiated[i].id,
      createdAt: transactionsInitiated[i].createdAt,
      amount: transactionsInitiated[i].amount,
      message: transactionsInitiated[i].message,
      avatar: transactionsInitiated[i].receiver?.user.avatar,
      name: transactionsInitiated[i].receiver?.user.name,
      email: transactionsInitiated[i].receiver?.user.email || "",
      gettingMoney: false,
    };
    allTransactions.push(transaction);
  }
  for (let i = 0; i < transactionsReceived.length; i++) {
    const transaction: TTransaction = {
      id: transactionsReceived[i].id,
      createdAt: transactionsReceived[i].createdAt,
      amount: transactionsReceived[i].amount,
      message: transactionsReceived[i].message,
      avatar: transactionsReceived[i].sender?.user.avatar,
      name: transactionsReceived[i].sender?.user.name,
      email: transactionsReceived[i].sender?.user.email || "",
      gettingMoney: true,
    };
    allTransactions.push(transaction);
  }

  allTransactions = allTransactions.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <ScrollArea className="h-1/2 w-full mt-8">
      <div className="p-4 mx-auto ">
        <h4 className="mb-8 text-sm font-medium leading-none">
          Past Transactions
        </h4>
        {!id && <p>First create an account</p>}
        {allTransactions.map((t) => (
          <div
            key={t.id}
            className=" sm:flex-row sm:flex justify-between space-y-8 mb-8 sm:items-center"
          >
            <div className="flex space-x-2 items-center">
              <UserProfile
                avatar={t.avatar || ""}
                name={t.name || ""}
                email={t.email || ""}
              />
            </div>
            <div className="space-x-4 justify-start">
              {t.gettingMoney ? (
                <Badge className="text-sm text-blue-400 ml-auto font-medium">
                  +${t.amount}
                </Badge>
              ) : (
                <Badge className="text-sm text-rose-400 ml-auto font-medium">
                  -${t.amount}
                </Badge>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Badge className="hover:cursor-pointer">Message</Badge>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl h-fit">
                  <DialogHeader>
                    <DialogTitle>Message</DialogTitle>
                    <DialogDescription className="break-all">
                      {t.message}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AllTransactionsPage;
