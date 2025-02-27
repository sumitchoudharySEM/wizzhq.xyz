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

        // 2. Get user's telegram and x usernames from users table and store it in user variable
        const userQuery = `
            SELECT x_username, tg_username 
            FROM users 
            WHERE id = ?
        `;
        const [userRows] = await connection.execute(userQuery, [userId]);
        const user = userRows[0];

        if (!user) {
            return NextResponse.json(
                { error: "User details not found" },
                { status: 404 }
            );
        }

        // 3. Get claimed, points, given_on and point_type from all points tables and order by claimed and given_on
        const combinedPointsQuery = `
            WITH combined_points AS (
                -- Participation Points
                SELECT 
                    id,
                    claimed,
                    points,
                    point_given_on as given_on,
                    'Participation' as point_type
                FROM participation_points 
                WHERE user_id = ?

                UNION ALL

                -- Referral Points
                SELECT 
                    id,
                    claimed,
                    points,
                    user_joined_on as given_on,
                    'Referral' as point_type
                FROM refrel_points 
                WHERE user_refered_id = ?

                UNION ALL

                -- Contribution Points
                SELECT 
                    id,
                    claimed,
                    points,
                    given_on,
                    'Contribution' as point_type
                FROM contribution_points 
                WHERE (x_tg_username = ? OR x_tg_username = ?)
            )
            SELECT 
                id,
                claimed,
                points,
                given_on,
                point_type
            FROM combined_points
            ORDER BY claimed ASC, given_on DESC;
        `;

        // 4. Execute the combinedPointsQuery and return all points
        const [allPoints] = await connection.execute(combinedPointsQuery, [
            userId,
            userId,
            user.x_username,
            user.tg_username
        ]);

        return NextResponse.json({
            points: allPoints,
        });

    } catch (error) {
        console.error('Error in points overview route:', error);
        return NextResponse.json(
            { error: "Internal server error" },
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

        // 2. Parse the incoming request body
        const { pointType, pointId } = await request.json();

        // Validate input
        if (!pointType || !pointId) {
            return NextResponse.json(
                { error: "Missing point type or point ID" },
                { status: 400 }
            );
        }

        connection = await createConnection();

        // 3. Get user's telegram and x usernames for contribution points check
        const userQuery = `
            SELECT x_username, tg_username 
            FROM users 
            WHERE id = ?
        `;
        const [userRows] = await connection.execute(userQuery, [userId]);
        const user = userRows[0];

        // 4. Determine the correct points table based on point type
        let pointsTableQuery = '';
        let pointsTableName = '';
        switch(pointType) {
            case 'Participation':
                pointsTableQuery = `
                    SELECT claimed, points 
                    FROM participation_points 
                    WHERE id = ? AND user_id = ?
                `;
                pointsTableName = 'participation_points';
                break;
            case 'Referral':
                pointsTableQuery = `
                    SELECT claimed, points 
                    FROM refrel_points 
                    WHERE id = ? AND user_refered_id = ?
                `;
                pointsTableName = 'refrel_points';
                break;
            case 'Contribution':
                pointsTableQuery = `
                    SELECT claimed, points 
                    FROM contribution_points 
                    WHERE id = ? AND (x_tg_username = ? OR x_tg_username = ?)
                `;
                pointsTableName = 'contribution_points';
                break;
            default:
                return NextResponse.json(
                    { error: "Invalid point type" },
                    { status: 400 }
                );
        }

        // 5. Check if point is already claimed with strict validation
        const [pointRows] = await connection.execute(
            pointType === 'Contribution' 
                ? pointsTableQuery 
                : pointsTableQuery.replace('WHERE', 'WHERE'), 
            pointType === 'Contribution' 
                ? [pointId, user.x_username, user.tg_username]
                : [pointId, userId]
        );

        if (pointRows.length === 0) {
            return NextResponse.json(
                { error: "Point not found or not eligible for claiming" },
                { status: 404 }
            );
        }

        const pointRow = pointRows[0];
        if (pointRow.claimed) {
            return NextResponse.json(
                { error: "Point already claimed" },
                { status: 400 }
            );
        }

        // 6. Update the specific points table to mark as claimed
        const updatePointQuery = `
            UPDATE ${pointsTableName}
            SET claimed = 1, claimed_on = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        await connection.execute(updatePointQuery, [pointId]);

        // 7. Check and update claimed_points table
        const [existingClaimedPoints] = await connection.execute(
            'SELECT points FROM claimed_points WHERE user_id = ?', 
            [userId]
        );

        if (existingClaimedPoints.length > 0) {
            // a. Update existing row
            await connection.execute(
                'UPDATE claimed_points SET points = points + ? WHERE user_id = ?', 
                [pointRow.points, userId]
            );
        } else {
            // b. Insert new row
            await connection.execute(
                'INSERT INTO claimed_points (user_id, points) VALUES (?, ?)', 
                [userId, pointRow.points]
            );
        }

        // 8. Commit transaction and return success
        return NextResponse.json({
            message: "Points claimed successfully",
            claimedPoints: pointRow.points
        });

    } catch (error) {
        console.error('Error in points claim route:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } 
}
