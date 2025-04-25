import { db } from "@/app/db";
import { reportsTable } from "@/app/db/schema";
import { like, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const location = url.searchParams.get("location") || "";
  const status = url.searchParams.get("status") || "";

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const whereConditions = [];

    if (location) {
      whereConditions.push(like(reportsTable.location, `%${location}%`));
    }

    if (status) {
      whereConditions.push(like(reportsTable.status, `%${status}%`));
    }

    const result = await db
      .select()
      .from(reportsTable)
      .where(whereConditions.length ? and(...whereConditions) : undefined)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
