import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let connection;
  try {
    // 1. Authenticate user
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    // 2. Create a database connection
    connection = await createConnection();

    // 3. Check if the user exists in the verification table
    const [result] = await connection.query(
      "SELECT verified_at FROM verification_requests WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (!result || !result[0].verified_at) {
      return NextResponse.json(
        { isVerified: false },
        { status: 200 }
      );
    }

    // 4. If verified_at exists, the user is verified
    return NextResponse.json(
      { isVerified: true },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  } 
}

export async function POST(request: Request) {
  let connection;
  try {
    // 1. Authenticate user
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    // 2. Get telegram username from request
    const { telegramUsername } = await request.json();
    
    if (!telegramUsername) {
      return NextResponse.json(
        { error: "Telegram username is required" },
        { status: 400 }
      );
    }

    connection = await createConnection();

     // 3. Check if the user is already verified
     const [existingVerification] = await connection.execute(
      `SELECT * FROM verification_requests 
      WHERE user_id = ? AND telegram_username = ? AND verified_at IS NOT NULL`,
      [userId, telegramUsername]
    );

    if (existingVerification.length > 0) {
      return NextResponse.json(
        { message: "User is already verified" },
        { status: 200 }
      );
    }

    // 4. Delete any unverified previous verification codes
    await connection.execute(
      `DELETE FROM verification_requests 
      WHERE user_id = ? AND telegram_username = ? AND verified_at IS NULL`,
      [userId, telegramUsername]
    );

    // 5. Generate 6-digit verification code
    const verificationCode = Math.random().toString().slice(2, 8);
    
    await connection.execute(
      `INSERT INTO verification_requests (
        user_id, 
        telegram_username, 
        verification_code
      ) VALUES (?, ?, ?)`,
      [userId, telegramUsername, verificationCode]
    );

    // 6. Return verification code and bot username
    return NextResponse.json({
      verificationCode,
      botUsername: process.env.TELEGRAM_BOT_USERNAME
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}