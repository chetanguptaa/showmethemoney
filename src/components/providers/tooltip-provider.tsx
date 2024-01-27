import React from "react";
import { TooltipProvider } from "../ui/tooltip";

type Props = {
  children: React.ReactNode;
};

const ToolTipProvider = ({ children }: Props) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

export default ToolTipProvider;
