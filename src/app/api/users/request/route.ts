import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getUserSession } from "@/app/lib/auth";
import z from "zod";
import {
  TErrorReceiverAccount,
  TErrorSenderAccount,
  TErrorServer,
  TStatusFailure,
  TStatusSuccess,
} from "../send/route";

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

export async function POST(req: NextRequest) {
  const { id: senderId } = await getUserSession();
  const body = await req.json();
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
  const receiverId = body.id;
  if (senderId === receiverId) {
    return NextResponse.json(
      {
        message: "Can't request money from yourself",
      },
      {
        status: 418,
        statusText: "Look at ye, you handsome lad with eyes bright as a lady",
      }
    );
  }
  const res = await requestTransfer(
    senderId,
    receiverId,
    body.amount,
    body.message
  );
  if (res.message === "success") {
    return NextResponse.json(
      {
        message: "Request sent successfully",
      },
      {
        status: 200,
      }
    );
  }
  if (res.message === "failure") {
    if (res.error === "sender") {
      return NextResponse.json(
        {
          message: "Please first create an account",
        },
        { status: 401 }
      );
    }
    if (res.error === "receiver") {
      return NextResponse.json(
        {
          message: "No account found",
        },
        {
          status: 401,
        }
      );
    }
  }
}

function requestTransfer(
  senderId: string,
  receiverId: string,
  amount: number,
  message: string
):
  | Promise<
      | {
          message: TStatusFailure;
          error: TErrorSenderAccount | TErrorReceiverAccount;
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
      const receiver = await tx.account.findFirst({
        where: {
          userId: receiverId,
        },
      });
      if (sender === null || receiver === null) {
        if (sender === null) {
          return {
            message: "failure",
            error: "sender",
          };
        }
        return {
          message: "failure",
          error: "receiver",
        };
      }
      const notification = await tx.notification.create({
        data: {
          amount: amount,
          message: message,
          type: "REQUEST",
        },
      });
      await tx.account.update({
        data: {
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
