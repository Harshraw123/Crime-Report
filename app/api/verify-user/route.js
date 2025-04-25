import { db } from "@/app/db";
import { usersTable, adminTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const { userData } = await request.json();

    const email = userData?.primaryEmailAddress?.emailAddress;
    const name = userData?.fullName || "Unknown";
    const role = userData?.publicMetadata?.role;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 🔍 Check if user exists in usersTable
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    let userId;

    if (!existingUser) {
      const reportId = uuidv4();
      const [insertedUser] = await db
        .insert(usersTable)
        .values({ email, name, reportId })
        .returning();

      userId = insertedUser.id;
    } else {
      userId = existingUser.id;
    }

    
    if (role === "admin") {
      const [existingAdmin] = await db
        .select()
        .from(adminTable)
        .where(eq(adminTable.email, email))
        .limit(1);

      if (!existingAdmin) {
        await db.insert(adminTable).values({ email, name });
      } else {
        // Optionally update admin name if changed
        if (existingAdmin.name !== name) {
          await db
            .update(adminTable)
            .set({ name })
            .where(eq(adminTable.email, email));
        }
      }
    }

    return NextResponse.json({ message: "User synced successfully", role, userId });
  } catch (error) {
    console.error("❌ Error in verify-user API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
