import CheckBalance from "@/components/landing/check-balance";
import LandingComponent from "@/components/landing/landingComponents";

const components = [
  {
    text: "Create Account",
    description: "You can create a new account",
    url: "/create-account",
  },
  {
    text: "Transfer Money",
    description: "You can transfer money",
    url: "/send",
  },
  {
    text: "Request Money",
    description: "You can request money",
    url: "/request",
  },
  {
    text: "All Transactions",
    description: "See All Transactions",
    url: "/all-transactions",
  },
];

export default async function Home() {
  return (
    <div className="container grid grid-cols-1 gap-4 sm:max-w-screen-xl max-w-screen-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {components.map((component, i) => (
          <LandingComponent
            text={component.text}
            url={component.url}
            description={component.description}
            key={i}
          />
        ))}
        <CheckBalance />
      </div>
    </div>
  );
}
