import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getUserSession } from "@/app/lib/auth";
import z from "zod";

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
        message: "Can't request money from yourself",
      },
      {
        status: 418,
        statusText: "Look at ye, you handsome lad with eyes bright as a lady",
      }
    );
  }
}
