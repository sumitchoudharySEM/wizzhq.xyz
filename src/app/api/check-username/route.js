export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const userId = searchParams.get('userId');

  if (!username || !userId) {
    return NextResponse.json(
      { error: "Username and userId are required" },
      { status: 400 }
    );
  }

  try {
    const pool = await createConnection();
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND id != ?",
      [username, userId]
    );

    return NextResponse.json({
      available: existingUser.length === 0,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Error checking username availability" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const creator_id = searchParams.get('userId');

  if (!username || !creator_id) {
    return NextResponse.json(
      { error: "Username and creator_id are required" },
      { status: 400 }
    );
  }

  try {
    const pool = await createConnection();
    const [existingUser] = await pool.query(
      "SELECT * FROM partners WHERE username = ? AND creator_id != ?",
      [username, creator_id]
    );

    return NextResponse.json({
      available: existingUser.length === 0,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Error checking username availability" },
      { status: 500 }
    );
  }
}