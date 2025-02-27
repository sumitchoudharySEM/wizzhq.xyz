export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export async function GET(request) {
  let connection;
  try {
    const session = await auth();
    console.log("Admin check session:", session);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userid = session.user.id;
    connection = await createConnection();
    
    const [admins] = await connection.query(
      "SELECT * FROM admins WHERE user_id = ?", 
      [userid]
    );

    console.log("Admin query result:", admins);

    if (!admins || admins.length === 0) {
      return NextResponse.json({ admin: null });
    }

    return NextResponse.json({ admin: admins[0] });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  } 
}


