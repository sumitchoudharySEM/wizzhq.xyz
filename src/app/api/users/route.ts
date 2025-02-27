export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET(request: Request) {

  let connection;
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const value = url.searchParams.get("value");

    if (!key || !value) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    connection = await createConnection();
    const [user] = await connection.query(
      `SELECT * FROM users WHERE ?? = ?`,
      [key, value]
    );

    if (user.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: user[0] });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const pool = await createConnection();
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}




