import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import z from "zod";

export type TStatusFailure = "failure";
export type TStatusSuccess = "success";
export type TErrorSenderAccount = "senderAccount";
export type TErrorReceiverAccount = "receiverAccount";
export type TErrorBalance = "balance";
export type TErrorServer = "server";
export type TErrorRequest = "request";

const bodySchema = z
  .object({
    id: z.string({
      required_error: "should be a string",
    }), //// This ID is of notification
  })
  .strict();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const isValid = bodySchema.safeParse(body);
  if (!isValid.success) {
    return NextResponse.json(
      {
        message: "Invalid inputs",
        error: isValid.error,
      },
      {
        status: 400,
      }
    );
  }
  const res = await transfer(body.id);
  if (res.message === "success") {
    return NextResponse.json(
      {
        message: "Money sent successfully",
      },
      {
        status: 200,
      }
    );
  }
  if (res.message === "failure") {
    if (res.error === "senderAccount") {
      return NextResponse.json(
        {
          message: "Please first create an account",
        },
        { status: 401 }
      );
    }
    if (res.error === "receiverAccount") {
      return NextResponse.json(
        {
          message: "No account found",
        },
        {
          status: 401,
        }
      );
    }
    if (res.error === "balance") {
      return NextResponse.json(
        {
          message: "Insufficient Balance",
        },
        {
          status: 400,
          statusText: "Insufficient Balance",
        }
      );
    }
  }
}

function transfer(notificationId: string):
  | Promise<
      | {
          message: TStatusFailure;
          error:
            | TErrorSenderAccount
            | TErrorReceiverAccount
            | TErrorBalance
            | TErrorRequest;
        }
      | { message: TStatusSuccess }
    >
  | { message: TStatusFailure; error: TErrorServer } {
  try {
    return prisma.$transaction(async (tx) => {
      const request = await tx.notification.findFirst({
        where: {
          id: notificationId,
        },
      });

      if (request === null) {
        return {
          message: "failure",
          error: "request",
        };
      }
      const sender = await tx.account.findFirst({
        where: {
          id: request.receiverId || "",
        },
      });

      if (sender === null) {
        return {
          message: "failure",
          error: "receiverAccount",
        };
      }
      const receiver = await tx.account.findFirst({
        where: {
          id: request.senderId || "",
        },
      });

      if (receiver === null) {
        return {
          message: "failure",
          error: "receiverAccount",
        };
      }

      if (sender.balance < request.amount) {
        return {
          message: "failure",
          error: "balance",
        };
      }
      const transaction = await tx.transaction.create({
        data: {
          amount: request.amount,
          message: request.message,
        },
      });

      await tx.account.update({
        data: {
          balance: {
            increment: request.amount,
          },
          transactionsInitiated: {
            connectOrCreate: {
              where: {
                id: transaction.id,
              },
              create: {
                receiverId: request.receiverId,
                amount: request.amount,
                message: request.message,
              },
            },
          },
        },
        where: {
          id: request.senderId || "",
        },
      });

      await tx.account.update({
        data: {
          balance: {
            decrement: request.amount,
          },
          transactionsReceived: {
            connectOrCreate: {
              where: {
                id: transaction.id,
              },
              create: {
                senderId: request.senderId,
                amount: request.amount,
                message: request.message,
              },
            },
          },
        },
        where: {
          id: request.receiverId || "",
        },
      });

      await prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          isFullfilled: true,
        },
      });
      return {
        message: "success",
      };
    });
  } catch (error: any) {
    return {
      message: "failure",
      error: "server",
    };
  }
}
