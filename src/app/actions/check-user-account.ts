"use server";

import { getUserSession } from "../lib/auth";
import prisma from "../lib/prisma";

export async function checkUserAccount() {
  const { id } = await getUserSession();
  return await ifAccountExist(id);
}

const ifAccountExist = async (id: string) => {
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
