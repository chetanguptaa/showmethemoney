import React from "react";
import { Bell, BellDot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import prisma from "@/app/lib/prisma";
import UserProfile from "../userProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import AcceptOrReject from "./acc-or-rej";
import Seen from "./seen";

const NotificationsRenderer = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      isFullfilled: false,
      receiverId: accountId,
      isRejected: false,
      isSeen: false,
    },
    select: {
      id: true,
      amount: true,
      message: true,
      type: true,
      sender: {
        select: {
          user: {
            select: {
              avatar: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return notifications.length === 0 ? (
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
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <BellDot className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-2/5">
        <ScrollArea className="h-full w-full">
          <div className="p-4">
            <h4 className="mb-8 text-sm font-medium leading-none">
              Notifications
            </h4>
            {notifications.map((notification) => (
              <div key={notification.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserProfile
                      name={notification.sender?.user.name || ""}
                      email={notification.sender?.user.email || ""}
                      avatar={notification.sender?.user.avatar || ""}
                    />
                  </div>
                  {notification.type === "REQUEST" ? (
                    <div className="hidden sm:flex items-center gap-12">
                      <AcceptOrReject id={notification.id} />
                    </div>
                  ) : (
                    <Seen id={notification.id} Pclass="hidden sm:flex" />
                  )}
                </div>
                <div className="mt-8 space-x-7 flex justify-between">
                  <div className="space-x-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Badge className="hover:cursor-pointer">Message</Badge>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl h-fit">
                        <DialogHeader>
                          <DialogTitle>Message</DialogTitle>
                          <DialogDescription className="break-all">
                            {notification.message}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Badge
                      className={
                        notification.type === "SENT"
                          ? "text-blue-400"
                          : "text-black"
                      }
                    >
                      $ {notification.type === "SENT" && "+ "}
                      {notification.amount}
                    </Badge>
                  </div>

                  {notification.type === "REQUEST" ? (
                    <div className="flex sm:hidden items-center gap-8">
                      <AcceptOrReject id={notification.id} />
                    </div>
                  ) : (
                    <Seen id={notification.id} Pclass="block sm:hidden" />
                  )}
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsRenderer;
