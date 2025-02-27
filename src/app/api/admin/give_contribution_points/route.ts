// /api/admin/give_contribution_points/route.ts
import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    let connection;
    try {
        // 1. Get user email from session using auth()
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        connection = await createConnection();

        // 2. Check whether the user is an admin
        const [adminRows] = await connection.execute(
            'SELECT * FROM admins WHERE user_email = ?',
            [session.user.email]
        );

        // 3. If the user is not an admin, return an error
        if (!Array.isArray(adminRows) || adminRows.length === 0) {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 }
            );
        }

        // 4. parse request body to get the req fields
        const body = await request.json();
        const { type_x_tg, x_tg_username, points } = body;

        // 5. Check if required fields are present
        if (!type_x_tg || !x_tg_username || !points) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 6. Check if points is a positive number
        if (isNaN(points) || points < 0) {
            return NextResponse.json(
                { error: "Points must be a positive number" },
                { status: 400 }
            );
        }

        // 7. Query to insert the contribution points in the db
        const [result] = await connection.execute(
            `INSERT INTO contribution_points
            (type_x_tg, x_tg_username, points, claimed) 
            VALUES (?, ?, ?, ?)`,
            [type_x_tg, x_tg_username, points, 0]
        );

        return NextResponse.json({ 
            message: "Points assigned successfully",
            id: result.insertId 
        });

    } catch (error) {
        console.error('Error in assigning contribution points', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } 
}