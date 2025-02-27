export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    let connection;

    try {
        const url = new URL(request.url);
        const username = url.searchParams.get("user_id");

        if (!username) {
            return NextResponse.json({ error: "No username found" }, { status: 400 });
        }

        connection = await createConnection();

        // Single query to fetch user submissions with username join
        const [submissions] = await connection.query(
            `SELECT bs.id, bs.reward 
             FROM bounty_submissions bs
             JOIN users u ON bs.user_id = u.id
             WHERE u.username = ?`,
            [username]
        );

        return NextResponse.json({ submissions });
    } catch (error) {
        console.error("Error fetching user submissions:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } 
}