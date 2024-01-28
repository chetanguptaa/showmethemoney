"use client";

import React from "react";
import { Check } from "lucide-react";
import { seeNot } from "@/app/actions/seen-notification";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  Pclass: string;
};

const Seen = ({ id, Pclass }: Props) => {
  const router = useRouter();
  const seenNotification = async () => {
    await seeNot(id);
    router.refresh();
  };
  return (
    <Check
      onClick={seenNotification}
      className={`hover:cursor-pointer ${Pclass} `}
    />
  );
};

export default Seen;
