import { getUserSession } from "./lib/auth";

export default async function Home() {
  const session = await getUserSession();
  return <div>{JSON.stringify(session)}</div>;
}
