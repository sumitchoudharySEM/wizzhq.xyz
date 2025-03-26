export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, public_address, seed } = await request.json();

    if (!userId || !public_address || !seed) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const connection = await createConnection();
    const [existingWallets] = await connection.query(
      "SELECT * FROM xrp_wallets WHERE user_id = ?",
      [userId]
    );

    if (existingWallets.length > 0) {
      return NextResponse.json({
        message: "Wallet already exists",
        public_address: existingWallets[0].public_address,
      });
    }

    await connection.query(
      `INSERT INTO xrp_wallets (user_id, public_address, seed) 
       VALUES (?, ?, ?)`,
      [userId, public_address, seed ]
    );

    return NextResponse.json({
      message: "Wallet saved successfully",
      public_address,
    });
  } catch (error) {
    console.error("Error saving wallet:", error);
    return NextResponse.json(
      { error: "Failed to save wallet", details: error.message },
      { status: 500 }
    );
  }
}