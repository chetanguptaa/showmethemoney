"use client";

import React from "react";
import { Check } from "lucide-react";
import { seeNot } from "@/app/actions/seen-notification";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

const Seen = ({ id }: Props) => {
  const router = useRouter();
  const seenNotification = async () => {
    await seeNot(id);
    router.refresh();
  };
  return <Check onClick={seenNotification} className="hover:cursor-pointer" />;
};

export default Seen;
