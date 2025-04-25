import { db } from "@/app/db"; // your Drizzle db instance
import { reportsTable } from "@/app/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const location = url.searchParams.get("filterLocation") || "";
  const date = url.searchParams.get("filterDate") || "";
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const filters = [];
  if (location) filters.push(ilike(reportsTable.location, `%${location}%`));
  if (date) filters.push(eq(reportsTable.createdAt, date));

  const result = await db
    .select()
    .from(reportsTable)
    .where(filters.length ? and(...filters) : undefined)
    .limit(pageSize)
    .offset(offset);

  return NextResponse.json({ result });
}
