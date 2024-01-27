"use client";

import { handleReject } from "@/app/actions/handle-reject";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Check, XIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

const AcceptOrReject = ({ id }: Props) => {
  const router = useRouter();
  const handleAccept = async () => {
    try {
      const response = await axios.post("/api/users/accept", {
        id,
      });
      toast({
        variant: "default",
        title: "Success",
        description: response.data.message,
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failure",
        description: error.response.data.message,
      });
      router.refresh();
    }
  };
  const handleRejectClient = async () => {
    const res = await handleReject(id);
    if (res.status === "failure") {
      toast({
        variant: "default",
        title: "Error",
        description: res.error,
      });
    } else {
      toast({
        variant: "default",
        title: "Success",
        description: res.message,
      });
    }
    router.refresh();
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <XIcon
            className="hover:cursor-pointer"
            onClick={handleRejectClient}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Reject</p>
        </TooltipContent>
      </Tooltip>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Check className="hover:cursor-pointer" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AcceptOrReject;
