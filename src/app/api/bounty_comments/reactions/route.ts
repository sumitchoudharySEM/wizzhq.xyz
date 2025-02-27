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
        const { target_id, target_type, reaction_type } = body;

        // 4. Validate all inputs
        if (!target_id || !target_type || !reaction_type) {
            return NextResponse.json(
                { error: "target_id, target_type, and reaction_type are required" },
                { status: 400 }
            );
        }

        connection = await createConnection();

        // 5. Check if reaction already exists
        const [existingReaction] = await connection.query(`
            SELECT id FROM reactions 
            WHERE user_id = ? 
            AND target_id = ? 
            AND target_type = ?
        `, [currentUserId, target_id, target_type]);

        if (existingReaction.length > 0) {
            // a. If reaction exists and matches current reaction type, delete it
            await connection.query(`
                DELETE FROM reactions 
                WHERE user_id = ? 
                AND target_id = ? 
                AND target_type = ?
            `, [currentUserId, target_id, target_type]);
        } else {
            // b. Insert new reaction
            await connection.query(`
                INSERT INTO reactions 
                (user_id, target_id, target_type, reaction_type) 
                VALUES (?, ?, ?, ?)
            `, [currentUserId, target_id, target_type, reaction_type]);
        }

        return NextResponse.json(
            { message: "Reaction processed successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in create reaction route:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } 
}