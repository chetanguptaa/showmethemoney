import React from "react";
import { MoveRight, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";

type Props = {
  text: string;
  description: string;
  url: string;
};

const LandingComponent = ({ text, description, url }: Props) => {
  return (
    <Link href={url}>
      <Alert className="border-none hover:cursor-pointer hover:scale-110 transition-transform">
        <Terminal className="h-4 w-4" />
        <AlertTitle>{text}</AlertTitle>
        <AlertDescription className="flex justify-between">
          <p>{description}</p>
          <MoveRight className="hover:cursor-pointer hover:scale-110 transition-transform" />
        </AlertDescription>
      </Alert>
    </Link>
  );
};

export default LandingComponent;
