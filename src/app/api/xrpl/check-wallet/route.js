export const dynamic = "force-dynamic";

// pages/api/xrpl/check-wallet.js
import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const connection = await createConnection();
    const [wallets] = await connection.query(
      "SELECT public_address, seed FROM xrp_wallets WHERE user_id = ?",
      [userId]
    );

    if (wallets.length > 0) {
      return NextResponse.json({ wallet: wallets[0] });
    } else {
      return NextResponse.json({ wallet: null });
    }
  } catch (error) {
    console.error("Error checking wallet:", error);
    return NextResponse.json(
      { error: "Failed to check wallet", details: error.message },
      { status: 500 }
    );
  }
}