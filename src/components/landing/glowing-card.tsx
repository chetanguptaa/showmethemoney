import React from "react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsTitle,
} from "../ui/glowing-stars";
import { Roboto_Serif } from "next/font/google";

export const rs = Roboto_Serif({ subsets: ["latin"], weight: "400" });

type Props = {
  text: string;
  url: string;
};

export function GlowingCard({ text, url }: Props) {
  return (
    <div className={rs.className}>
      <div className="flex flex-row sm:flex-col py-4 items-center justify-center antialiased">
        <GlowingStarsBackgroundCard>
          <GlowingStarsTitle
            className="text-center underline underline-offset-4 group-hover:underline-offset-8 transition-all duration-300 ease-in-out hover:cursor-pointer"
            url={url}
          >
            {text}
          </GlowingStarsTitle>
        </GlowingStarsBackgroundCard>
      </div>
    </div>
  );
}
