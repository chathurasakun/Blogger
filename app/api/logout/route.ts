import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();

  if (session) {
    // Delete session from database
    await prisma.session.delete({
      where: { id: session.id },
    });
  }

  // Delete session cookie
  cookies().delete("session");

  return NextResponse.json({ ok: true });
}

