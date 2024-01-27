"use server";

import prisma from "../lib/prisma";
import { TStatusSuccess, TStatusFailure } from "../api/users/send/route";

export async function handleReject(
  id: string
): Promise<
  | { status: TStatusSuccess; message: string }
  | { status: TStatusFailure; error: string }
> {
  try {
    const request = await prisma.notification.findFirst({
      where: {
        id,
        type: "REQUEST",
      },
      select: {
        isRejected: true,
      },
    });

    if (request === null) {
      return {
        status: "failure",
        error: "Request does not exist",
      };
    }
    if (request.isRejected) {
      return {
        status: "failure",
        error: "Request is already rejected",
      };
    }

    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRejected: true,
        isSeen: true,
      },
    });
    return {
      status: "success",
      message: "Rejected successfully",
    };
  } catch (error) {
    return {
      status: "failure",
      error: "Internal server error",
    };
  }
}
