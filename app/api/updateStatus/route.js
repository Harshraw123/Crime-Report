import { db } from "@/app/db";
import { NextResponse } from "next/server";
import { reportsTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  const body = await request.json();
  const { reportId, status } = body;

  const updated = await db
    .update(reportsTable)
    .set({ status })
    .where(eq(reportsTable.reportUid, reportId));

  return NextResponse.json({ success: true, updated });
}
