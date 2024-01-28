"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MoveRight, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type Props = {
  text: string;
  description: string;
  url: string;
};

const LandingComponent = ({ text, description, url }: Props) => {
  const router = useRouter();
  return (
    <>
      <Alert className=" border-none">
        <Terminal className="h-4 w-4" />
        <AlertTitle>{text}</AlertTitle>
        <AlertDescription className="flex justify-between">
          <p>{description}</p>
          <MoveRight
            className="hover:cursor-pointer hover:scale-110 transition-transform"
            onClick={() => router.push(url)}
          />
        </AlertDescription>
      </Alert>
    </>
  );
};

export default LandingComponent;
