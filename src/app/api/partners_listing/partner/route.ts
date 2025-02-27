export const dynamic = 'force-dynamic'

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  let connection;

  try {
    // Get partnerId from the request URL parameters
    const url = new URL(request.url);
    const partnerId = url.searchParams.get("id");

    if (!partnerId) {
      return NextResponse.json({ error: "No partner id provided" }, { status: 400 });
    }

    connection = await createConnection();

    // Query based on partner's ID instead of creator ID
    const [partners] = await connection.query(
      "SELECT * FROM partners WHERE id = ?", 
      [partnerId] 
    );

    if (partners.length === 0) {
      return NextResponse.json({ partners: null }); 
    }

    return NextResponse.json({ partner: partners[0] });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}