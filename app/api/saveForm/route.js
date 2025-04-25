import { db } from "@/app/db";
import { NextResponse } from "next/server";
import { reportsTable } from "@/app/db/schema";

export async function POST(request){

    const{imgUrl,reportStatus, incidentType, location, report, reportType, reportId,uid}=await request.json();

    try {
        const result = await db.insert(reportsTable).values({
            
            imgUrl: imgUrl, // Assuming you send the Cloudinary URL
        incidentType,
       location,
       report,
        reportType,
        reportUid: uid,
        status: reportStatus,
            userId: reportId,
            createdAt: new Date(), // Add a timestamp for when the report was created
            updatedAt: new Date(), // Initialize updatedAt as well
        }).returning();

        return NextResponse.json({ result: result });

    } catch (error) {
        console.error("Error inserting report:", error);
        return NextResponse.json({ error: "Failed to save report to the database." }, { status: 500 });
    }
}