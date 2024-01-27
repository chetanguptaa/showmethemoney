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

const NotificationsRenderer = async ({ accountId }: { accountId: string }) => {
  const requests = await prisma.request.findMany({
    where: {
      receiverId: accountId,
      isFullfilled: false,
      isRejected: false,
    },
    select: {
      id: true,
      amount: true,
      message: true,
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
  });
  return requests.length === 0 ? (
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
      <DialogContent className="sm:max-w-2xl h-3/5">
        <ScrollArea className="h-full w-full">
          <div className="p-4">
            <h4 className="mb-8 text-sm font-medium leading-none">
              Notifications
            </h4>
            {requests.map((request) => (
              <div key={request.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserProfile
                      name={request.sender?.user.name || ""}
                      email={request.sender?.user.email || ""}
                      avatar={request.sender?.user.avatar || ""}
                    />
                  </div>
                  <div className="flex items-center gap-12">
                    <AcceptOrReject id={request.id} />
                  </div>
                </div>
                <div className="mt-8 space-x-7">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Badge>Message</Badge>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl h-fit">
                      <DialogHeader>
                        <DialogTitle>Message</DialogTitle>
                        <DialogDescription className="break-all">
                          {request.message}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Badge>$ {request.amount}</Badge>
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
