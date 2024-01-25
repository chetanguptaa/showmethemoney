import React from "react";
import { ThemeProvider } from "./providers/theme-provider";
import { NextAuthProvider } from "./providers/session-provider";
import { Toaster } from "@/components/ui/toaster";

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
        {children}
      </NextAuthProvider>
    </ThemeProvider>
  );
};

export default Providers;
