"use server";

import z from "zod";
import prisma from "../lib/prisma";
import { getUserSession } from "../lib/auth";

type TStatusSuccess = "success";
type TStatusFailure = "failure";

const amountSchema = z.number().min(100).max(10000);

export async function handleFormSubmit({
  amount,
}: {
  amount: string;
}): Promise<
  | { status: TStatusFailure; error: any }
  | { status: TStatusSuccess; id: string }
> {
  const { id } = await getUserSession();
  const doesAccountExist = await ifAccountAlreadyExist(id);
  if (doesAccountExist) {
    return {
      status: "failure",
      error: "account already exist",
    };
  }
  const amountInDollars = parseInt(amount);
  const isValid = amountSchema.safeParse(amountInDollars);
  if (!isValid.success) {
    return {
      status: "failure",
      error: isValid.error,
    };
  }
  const newAccount = await prisma.account.create({
    data: {
      userId: id,
      balance: amountInDollars,
    },
  });
  return {
    status: "success",
    id: newAccount.id,
  };
}

const ifAccountAlreadyExist = async (id: string) => {
  const account = await prisma.account.findFirst({
    where: {
      userId: id,
    },
  });
  if (account) {
    return true;
  }
  return false;
};
