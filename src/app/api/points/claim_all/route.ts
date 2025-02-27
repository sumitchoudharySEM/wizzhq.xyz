import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

//get req for checking if user has any claimable points
export async function GET(request: Request) {
    let connection;
    try {
        // 1. Get user id from session
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized - User not found" },
                { status: 401 }
            );
        }

        connection = await createConnection();

        // 2. Get user's telegram and x usernames
        const [userRows] = await connection.execute(
            'SELECT x_username, tg_username FROM users WHERE id = ?',
            [userId]
        );
        const user = userRows[0];

        if (!user) {
            return NextResponse.json(
                { error: "User details not found" },
                { status: 404 }
            );
        }

        // 3. Check for any claimable points across all tables in a single query
        const checkQuery = `
            SELECT 
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM participation_points 
                        WHERE user_id = ? AND claimed = 0
                        LIMIT 1
                    ) THEN 1
                    WHEN EXISTS (
                        SELECT 1 FROM refrel_points 
                        WHERE (user_refered_id = ?) 
                        AND claimed = 0
                        LIMIT 1
                    ) THEN 1
                    WHEN EXISTS (
                        SELECT 1 FROM contribution_points 
                        WHERE (x_tg_username = ? OR x_tg_username = ?)
                        AND claimed = 0
                        LIMIT 1
                    ) THEN 1
                    ELSE 0
                END as has_points
        `;

        const [result] = await connection.execute(checkQuery, [
            userId,
            userId, 
            user.x_username, user.tg_username
        ]);
        
        // 4. Extract the result and return
        const hasClaimablePoints = result[0].has_points === 1;

        return NextResponse.json({ hasClaimablePoints });

    } catch (error) {
        console.error('Error checking claimable points:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: "Internal server error", details: errorMessage },
            { status: 500 }
        );
    } 
}

export async function POST(request: Request) {
    let connection;
    try {
        // 1. Get user id from session
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized - User not found" },
                { status: 401 }
            );
        }

        connection = await createConnection();

        // 2. Start transaction
        await connection.query('START TRANSACTION');

        // 3. Get user's telegram and x usernames in a single query
        const [userRows] = await connection.execute(
            'SELECT x_username, tg_username FROM users WHERE id = ?',
            [userId]
        );
        const user = userRows[0];

        if (!user) {
            return NextResponse.json(
                { error: "User details not found" },
                { status: 404 }
            );
        }

        // 4. Calculate all points in a single query using UNION ALL
        const pointsQuery = `
            SELECT 
                'participation' as type,
                COALESCE(SUM(points), 0) as points
            FROM participation_points 
            WHERE user_id = ? AND claimed = 0

            UNION ALL

            SELECT 
                'referral' as type,
                COALESCE(SUM(points), 0) as points
            FROM refrel_points 
            WHERE (user_refered_id = ?) AND claimed = 0

            UNION ALL

            SELECT 
                'contribution' as type,
                COALESCE(SUM(points), 0) as points
            FROM contribution_points 
            WHERE (x_tg_username = ? OR x_tg_username = ?) AND claimed = 0
        `;

        const [pointsRows] = await connection.execute(pointsQuery, [
            userId,
            userId,
            user.x_username, user.tg_username
        ]);

        // 5. Extract points from results
        const points = {
            participation: Number(pointsRows[0]?.points || 0),
            referral: Number(pointsRows[1]?.points || 0),
            contribution: Number(pointsRows[2]?.points || 0)
        };

        const totalPointsClaimed = points.participation + points.referral + points.contribution;
        
        //6. If points to claim, update the tables
        if (totalPointsClaimed > 0) {
            // a. Execute updates separately but within the same transaction
            await connection.execute(
                `UPDATE participation_points 
                 SET claimed = 1, claimed_on = CURRENT_TIMESTAMP() 
                 WHERE user_id = ? AND claimed = 0`,
                [userId]
            );

            await connection.execute(
                `UPDATE refrel_points 
                 SET claimed = 1, claimed_on = CURRENT_TIMESTAMP() 
                 WHERE (user_refered_id = ?) AND claimed = 0`,
                [userId]
            );

            await connection.execute(
                `UPDATE contribution_points 
                 SET claimed = 1, claimed_on = CURRENT_TIMESTAMP() 
                 WHERE (x_tg_username = ? OR x_tg_username = ?) AND claimed = 0`,
                [user.x_username, user.tg_username]
            );
        }
        
        //7. Update claimed points table
        const [existingClaimedPoints] = await connection.execute(
            `SELECT points FROM claimed_points WHERE user_id = ?`,
            [userId]
        );

        if (existingClaimedPoints.length > 0) {
            await connection.execute(
                `UPDATE claimed_points 
                    SET points = points + ? 
                    WHERE user_id = ?`,
                [totalPointsClaimed, userId]
            );
        } else {
            await connection.execute(
                `INSERT INTO claimed_points (user_id, points) VALUES (?, ?)`,
                [userId, totalPointsClaimed]
            );
        }

        // Commit transaction
        await connection.query('COMMIT');
        
        // 8. Return the points claimed
        return NextResponse.json({
            success: true,
            pointsClaimed: {
                participation: points.participation,
                referral: points.referral,
                contribution: points.contribution,
                total: totalPointsClaimed
            }
        });

    } catch (error) {
        if (connection) {
            // Rollback transaction
            await connection.query('ROLLBACK');
        }
        console.error('Error in claim all points route:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: "Internal server error", details: errorMessage },
            { status: 500 }
        );
    }
}