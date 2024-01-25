import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getUserSession } from "@/app/lib/auth";

export async function GET(request: Request) {
  const { id } = await getUserSession();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          email: {
            contains: query,
          },
        },
      ],
      NOT: [
        {
          id,
        },
        {
          account: null,
        },
      ],
    },
    select: {
      id: true,
      email: true,
      avatar: true,
      name: true,
    },
  });
  return NextResponse.json(users);
}
