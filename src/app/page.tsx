import CheckBalance from "@/components/landing/check-balance";
import { GlowingCard } from "@/components/landing/glowing-card";

const components = [
  {
    text: "Create Account",
    url: "/create-account",
  },
  {
    text: "Transfer Money",
    url: "/send",
  },
  {
    text: "Request Money",
    url: "/request",
  },
  {
    text: "All Transactions",
    url: "/all-transactions",
  },
];

export default async function Home() {
  return (
    <div className="container sm:max-w-screen-xl max-w-screen-sm grid grid-cols-1 sm:grid-cols-2 sm:gap-4 gap-2 mt-8">
      {components.map((component, i) => (
        <GlowingCard text={component.text} url={component.url} key={i} />
      ))}
      <CheckBalance />
    </div>
  );
}
