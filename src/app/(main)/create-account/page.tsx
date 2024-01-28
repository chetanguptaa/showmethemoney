import CreateAccount from "@/components/main/create-account";
import React from "react";
import { getUserSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import HaveAccount from "@/components/have-account";

const CreateAccountPage = async () => {
  const session = await getUserSession();
  const userId = session.id;
  const account = await prisma.account.findFirst({
    where: {
      userId,
    },
  });
  return <>{account ? <HaveAccount /> : <CreateAccount />}</>;
};

export default CreateAccountPage;
