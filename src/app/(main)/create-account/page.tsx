import CreateAccount from "@/components/main/create-account";
import React from "react";
import { getUserSession } from "../../lib/auth";
import prisma from "../../lib/prisma";

const CreateAccountPage = async () => {
  const session = await getUserSession();
  const userId = session.id;
  const account = await prisma.account.findFirst({
    where: {
      userId,
    },
  });
  return (
    <>{account ? <p>You already have an account</p> : <CreateAccount />}</>
  );
};

export default CreateAccountPage;
