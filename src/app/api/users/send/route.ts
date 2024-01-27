import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getUserSession } from "@/app/lib/auth";
import z from "zod";

export type TStatusFailure = "failure";
export type TStatusSuccess = "success";
export type TErrorAccount = "account";
export type TErrorBalance = "balance";
export type TErrorServer = "server";
export type TErrorReceiverAccount = "receiver";
export type TErrorSenderAccount = "sender";

const bodySchema = z
  .object({
    amount: z
      .number({
        required_error: "should be a number",
      })
      .min(1, {
        message: "can't be less than 1",
      })
      .max(10000, {
        message: "can't be more than 10000",
      }),
    message: z
      .string({
        required_error: "should be a string",
      })
      .min(1, {
        message: "should be atleast one character long",
      })
      .max(100, {
        message: "should be atmost 100 characters long",
      }),
    id: z.string({
      required_error: "should be a string",
    }),
  })
  .strict();

export async function POST(request: NextRequest) {
  const { id } = await getUserSession();
  const body = await request.json();
  body.amount = parseFloat(body.amount);
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

  if (id === body.id) {
    return NextResponse.json(
      {
        message: "Can't send money to yourself",
      },
      {
        status: 418,
      }
    );
  }
  const res = await transfer(id, body.id, body.amount, body.message);
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
    if (res.error === "account") {
      return NextResponse.json(
        {
          message: "Invalid Account",
        },
        { status: 401 }
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

function transfer(
  senderId: string,
  receiverId: string,
  amount: number,
  message: string
):
  | Promise<
      | {
          message: TStatusFailure;
          error: TErrorAccount | TErrorBalance;
        }
      | { message: TStatusSuccess }
    >
  | { message: TStatusFailure; error: TErrorServer } {
  try {
    return prisma.$transaction(async (tx) => {
      const sender = await tx.account.findFirst({
        where: {
          userId: senderId,
        },
      });
      if (sender === null) {
        return {
          message: "failure",
          error: "account",
        };
      }
      if (sender.balance < amount) {
        return {
          message: "failure",
          error: "balance",
        };
      }
      const transaction = await tx.transaction.create({
        data: {
          amount: amount,
          message: message,
        },
      });
      const notification = await prisma.notification.create({
        data: {
          type: "SENT",
          amount,
          message,
        },
      });

      await tx.account.update({
        data: {
          balance: {
            decrement: amount,
          },
          transactionsInitiated: {
            connectOrCreate: {
              where: {
                id: transaction.id,
              },
              create: {
                receiverId,
                amount,
                message,
              },
            },
          },
          requestsCreated: {
            connectOrCreate: {
              where: {
                id: notification.id,
              },
              create: {
                receiverId,
                amount,
                message,
                type: "REQUEST",
              },
            },
          },
        },
        where: {
          userId: senderId,
        },
      });
      await tx.account.update({
        data: {
          balance: {
            increment: amount,
          },
          transactionsReceived: {
            connectOrCreate: {
              where: {
                id: transaction.id,
              },
              create: {
                senderId,
                amount,
                message,
              },
            },
          },
          requestsReceived: {
            connectOrCreate: {
              where: {
                id: notification.id,
              },
              create: {
                senderId,
                amount,
                message,
                type: "REQUEST",
              },
            },
          },
        },
        where: {
          userId: receiverId,
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
