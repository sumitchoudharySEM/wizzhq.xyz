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
        
        // 2. Get top 5 users with their details
        const [topUsers] = await connection.query(`
            SELECT 
                cp.user_id,
                u.name,
                u.username,
                u.image,
                cp.points,
                ROW_NUMBER() OVER (ORDER BY cp.points DESC) as position
            FROM claimed_points cp
            JOIN users u ON cp.user_id = u.id
            ORDER BY cp.points DESC
            LIMIT 5
        `);

        // 3. Get authenticated user's position and details
        const [authUserData] = await connection.query(`
            WITH RankedUsers AS (
                SELECT 
                    user_id,
                    points,
                    ROW_NUMBER() OVER (ORDER BY points DESC) as position
                FROM claimed_points
            )
            SELECT 
                ru.user_id,
                u.name,
                u.username,
                u.image,
                ru.points,
                ru.position
            FROM RankedUsers ru
            JOIN users u ON ru.user_id = u.id
            WHERE ru.user_id = ?
        `, [userId]);
        
        // 4. store the auth user data in a variable
        const authUser = authUserData[0] || null;
        
        // 5. return the data in object
        return NextResponse.json({
            topUsers,
            authUser,
            isAuthUserInTop5: topUsers.some((user: any) => user.user_id === userId)
        });

    } catch (error) {
        console.error('Error in points overview route:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}