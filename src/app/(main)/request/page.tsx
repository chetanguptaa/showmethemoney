import React from "react";
import { getUserSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import Request from "@/components/main/request-money/request";
import NoAccount from "@/components/no-account";

const RequestPage = async () => {
  const session = await getUserSession();
  const userId = session.id;
  const account = await prisma.account.findFirst({
    where: {
      userId,
    },
  });
  return <>{account === null ? <NoAccount /> : <Request />}</>;
};

export default RequestPage;
