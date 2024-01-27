"use server";

import prisma from "../lib/prisma";

export async function seeNot(id: string) {
  try {
    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isSeen: true,
      },
    });
  } catch (error) {
    return {
      status: "failure",
      error: "Internal server error",
    };
  }
}
