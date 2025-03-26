export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const connection = await createConnection();
    const [wallets] = await connection.query(
      "SELECT public_address FROM xrp_wallets WHERE user_id = ?",
      [userId]
    );

    if (wallets.length === 0) {
      return NextResponse.json(
        { error: "No wallet found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      public_address: wallets[0].public_address,
    });
  } catch (error) {
    console.error("Error fetching public key:", error);
    return NextResponse.json(
      { error: "Failed to fetch public key", details: error.message },
      { status: 500 }
    );
  }
}