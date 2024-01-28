"use server";

import prisma from "../lib/prisma";
import { getUserSession } from "../lib/auth";
import { TStatusFailure, TStatusSuccess } from "../api/users/send/route";

export async function checkAccountBalanceAction(): Promise<
  | { status: TStatusFailure; error: any }
  | { status: TStatusSuccess; balance: number | undefined }
> {
  try {
    const { id } = await getUserSession();
    const doesAccountExist = await ifAccountAlreadyExist(id);
    if (!doesAccountExist) {
      return {
        status: "failure",
        error: "account does not exist",
      };
    }
    const account = await prisma.account.findFirst({
      where: {
        userId: id,
      },
      select: {
        balance: true,
      },
    });
    return {
      status: "success",
      balance: account?.balance,
    };
  } catch (error) {
    return {
      status: "failure",
      error: "Internal Server Error",
    };
  }
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
