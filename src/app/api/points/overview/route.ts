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

    // 2. Get user's telegram and x usernames from users table
    const [userResult] = await connection.execute(
      'SELECT tg_username, x_username FROM users WHERE id = ?',
      [userId]
    );
    
    // 3. Store it in user variable
    const user = userResult[0];
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Q1: Get total claimed points
    const [claimedPointsResult] = await connection.execute(
      'SELECT points FROM claimed_points WHERE user_id = ?',
      [userId]
    );
    const totalClaimedPoints = claimedPointsResult[0]?.points || 0;

    // Q2: Get sum of participation points where claimed = 1
    const [participationPointsResult] = await connection.execute(
      'SELECT SUM(points) as total_participation_points FROM participation_points WHERE user_id = ? AND claimed = 1',
      [userId]
    );
    const totalParticipationPoints = participationPointsResult[0]?.total_participation_points || 0;

    // Q3: Get sum of referral points where claimed = 1
    const [referralPointsResult] = await connection.execute(
      'SELECT SUM(points) as total_referral_points FROM refrel_points WHERE user_refered_id = ? AND claimed = 1',
      [userId]
    );
    const totalReferralPoints = referralPointsResult[0]?.total_referral_points || 0;

    // Q4: Get contribution points where x_tg_username matches with either x_username or tg_username and claimed = 1
    const [contributionPointsResult] = await connection.execute(
      `SELECT SUM(points) as total_contribution_points 
       FROM contribution_points 
       WHERE (x_tg_username = ? OR x_tg_username = ?) 
       AND claimed = 1`,
      [user.tg_username, user.x_username]
    );
    const totalContributionPoints = contributionPointsResult[0]?.total_contribution_points || 0;

    // Q5: Single optimized query for all unclaimed points using UNION ALL
    const [unclaimedPointsResult] = await connection.execute(
      `SELECT SUM(points) as total_unclaimed_points FROM (
        SELECT points FROM participation_points 
        WHERE user_id = ? AND claimed = 0
        UNION ALL
        SELECT points FROM refrel_points 
        WHERE user_refered_id = ? AND claimed = 0
        UNION ALL
        SELECT points FROM contribution_points 
        WHERE (x_tg_username = ? OR x_tg_username = ?) 
        AND claimed = 0
      ) as combined_points`,
      [userId, userId, user.tg_username, user.x_username]
    );
    const totalUnclaimedPoints = unclaimedPointsResult[0]?.total_unclaimed_points || 0;

    // 4. Combine all points data in a single object
    const pointsOverview = {
      claimed_points: Number(totalClaimedPoints),
      participation_points: Number(totalParticipationPoints),
      referral_points: Number(totalReferralPoints),
      contribution_points: Number(totalContributionPoints),
      totalUnclaimedPoints: Number(totalUnclaimedPoints),
    };

    return NextResponse.json(pointsOverview, { status: 200 });

  } catch (error) {
    console.error('Error in points overview route:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}