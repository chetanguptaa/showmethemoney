import React from "react";
import { getUserSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import Send from "@/components/main/send-money/send";
import NoAccount from "@/components/no-account";

const SendPage = async () => {
  const session = await getUserSession();
  const userId = session.id;
  const account = await prisma.account.findFirst({
    where: {
      userId,
    },
  });
  return <>{account === null ? <NoAccount /> : <Send />}</>;
};

export default SendPage;
