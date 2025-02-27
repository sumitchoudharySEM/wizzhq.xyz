import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    let connection;
    try {
        // 1. Get authenticated user
        const session = await auth();
        const currentUserId = session?.user?.id;

        // 2. Check if user is authenticated
        if (!currentUserId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // 3. Parse request body
        const body = await request.json();
        const { comment_id, reply_text } = body;

        // 4. Validate all inputs
        if (!reply_text || !comment_id) {
            return NextResponse.json(
                { error: "reply text and comment id are required" },
                { status: 400 }
            );
        }

        connection = await createConnection();

        // 5. Insert reply
        const [result] = await connection.query(`
            INSERT INTO replies 
            (user_id, comment_id, reply_text, created_at) 
            VALUES (?, ?, ?, NOW())
        `, [currentUserId, comment_id, reply_text]);

        return NextResponse.json(
            { reply_id: result.insertId },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error in create reply to a comment route:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } 
}