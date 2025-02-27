import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    let connection;
    try {

        // 1. Get user id from session using auth()
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized - User not found" },
                { status: 401 }
            );
        }

        connection = await createConnection();

        // 2. Get referral code from referral table
        const [referralResult] = await connection.execute(
            'SELECT refral_code FROM referral WHERE user_id = ?',
            [userId]
        );
        const referralCode = referralResult[0]?.refral_code || null;

        // 3. Get the referral count from refrel_points table
        const [referralCountResult] = await connection.execute(
            'SELECT COUNT(*) as referral_count FROM refrel_points WHERE user_refered_id = ?',
            [userId]
        );
        const referralCount = referralCountResult[0]?.referral_count || 0;

        // 4. return the data in object 
        const referralOverview = {
            referral_code: referralCode,
            total_referrals: Number(referralCount)
        };

        return NextResponse.json(referralOverview, { status: 200 });

    } catch (error) {
        console.error('Error in points overview route:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}