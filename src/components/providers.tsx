import React from "react";
import { ThemeProvider } from "./providers/theme-provider";
import { NextAuthProvider } from "./providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import ToolTipProvider from "./providers/tooltip-provider";

type Props = {
  children?: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextAuthProvider>
        <Toaster />
        <ToolTipProvider>{children}</ToolTipProvider>
      </NextAuthProvider>
    </ThemeProvider>
  );
};

export default Providers;
