import { getUserSession } from "@/app/lib/auth";
import React from "react";
import prisma from "@/app/lib/prisma";
import { Bell } from "lucide-react";
import NotificationsRenderer from "./nots-renderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Notifications = async () => {
  const user = await getUserSession();
  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });
  if (account === null || account === undefined) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Bell className="hover:cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <span>You do not have any new notifcations</span>
        </DialogContent>
      </Dialog>
    );
  }
  return <NotificationsRenderer accountId={account.id} />;
};

export default Notifications;
