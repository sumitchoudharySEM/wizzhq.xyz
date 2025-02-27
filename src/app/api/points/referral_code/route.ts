import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

async function generateUniqueReferralCode(): Promise<string> {
  const connection = await createConnection();
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = Math.floor(Math.random() * 2) + 6; // Random length between 6-7
  
  // Generate a unique referral code
  while (true) {
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const [existing] = await connection.query(
      'SELECT id FROM referral WHERE refral_code = ?',
      [code]
    );
    
    if (Array.isArray(existing) && existing.length === 0) {
      return code;
    }
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const connection = await createConnection();
    
    // Check if user already has a referral code
    const [existing] = await connection.query(
      'SELECT id FROM referral WHERE user_id = ?',
      [userId]
    );
    
    // If user doesn't have a referral code, generate one
    if (Array.isArray(existing) && existing.length === 0) {
      const referralCode = await generateUniqueReferralCode();
      await connection.query(
        'INSERT INTO referral (user_id, refral_code) VALUES (?, ?)',
        [userId, referralCode]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}