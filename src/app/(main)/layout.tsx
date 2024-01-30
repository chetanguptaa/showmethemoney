import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Show me the Money | Main",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container sm:max-w-screen-xl max-w-screen-sm">
      {children}
    </div>
  );
}
