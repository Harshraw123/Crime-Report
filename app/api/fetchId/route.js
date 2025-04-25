import { usersTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/app/db"; // Ensure this path is correct


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email parameter is required." }, { status: 400 });
  }

  try {
    const result = await db
      .select({ id: usersTable.id }) // Select only the 'id' column and alias it for clarity
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json({ result: [] }); // Return an empty array if no user is found
    }

    return NextResponse.json({ result: result }); // The result will be an array of objects, e.g., [{ id: 'some_id' }]
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch user ID from the database." },
      { status: 500 }
    );
  }
}