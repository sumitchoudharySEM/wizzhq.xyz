import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        // 1. Extract body from request
        const body = await request.json();
        console.log("Received referral data:", body);

        const { userId, referralCode } = body;

        // 2. If no userId or referralCode provided, return early
        if (!userId || !referralCode) {
            return NextResponse.json({ success: true });
        }

        const connection = await createConnection();

        // 3. Find referring user's ID from the referral code
        const [referringUser] = await connection.query(
            'SELECT user_id FROM referral WHERE refral_code = ?',
            [referralCode]
        );

        // 4. If invalid referral code, just continue with normal signup
        if (!Array.isArray(referringUser) || referringUser.length === 0) {
            return NextResponse.json({ success: true });
        }

        const referringUserId = referringUser[0].user_id;

        // 5. Add referral record
        const points = 200; // a. Points to be awarded for referral
        await connection.query(
            `INSERT INTO refrel_points 
       (user_refered_id, user_joined_id, refral_code, method, points) 
       VALUES (?, ?, ?, 'l', ?)`,
            [referringUserId, userId, referralCode, points]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing referral:", error);
        return NextResponse.json({ success: true });
    }
}