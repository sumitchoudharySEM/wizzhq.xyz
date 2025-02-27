import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    let connection;

    try {
        // 1. Get user email from session using auth()
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        connection = await createConnection();

        // 2. Check if the user is an admin
        const [adminRows] = await connection.execute(
            'SELECT * FROM admins WHERE user_email = ?',
            [session.user.email]
        );

        if (!Array.isArray(adminRows) || adminRows.length === 0) {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 }
            );
        }

        // 3. fetch all users
        const [users] = await connection.execute(
            'SELECT id, username FROM users ORDER BY username ASC'
        );

        return NextResponse.json({ users });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    let connection;

    try {
        // 1. Get user email from session using auth()
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        connection = await createConnection();

        // 2. Check if the user is an admin
        const [adminRows] = await connection.execute(
            'SELECT * FROM admins WHERE user_email = ?',
            [session.user.email]
        );

        if (!Array.isArray(adminRows) || adminRows.length === 0) {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 }
            );
        }

        // 3. Parse the request body
        const body = await request.json();

        // 4. Validate the request body
        if (!body.user_id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        if (!body.listing_id) {
            return NextResponse.json(
              { error: "Listing ID is required" },
              { status: 400 }
            );
          }

        if (!body.submission_links || !Array.isArray(body.submission_links) || body.submission_links.length === 0) {
            return NextResponse.json(
                { error: "At least one submission link is required" },
                { status: 400 }
            );
        }

        if (!body.wallet_address || !body.wallet_address.trim()) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            );
        }

        // 5. Check if the user exists whose submission is being added
        const [userExists] = await connection.execute(
            'SELECT id FROM users WHERE id = ?',
            [body.user_id]
        );

        if (!Array.isArray(userExists) || userExists.length === 0) {
            return NextResponse.json(
                { error: "Selected user not found" },
                { status: 404 }
            );
        }
        
        // 6. query to insert the submission
        const query = `
            INSERT INTO bounty_submissions (
            user_id,
            listing_id,
            submission_links,
            tweet_link,
            additional_info,
            wallet_address,
            submitted_on
            ) VALUES (?, ?, ?, ?, ?, ?, NOW())`

        const values = [
            body.user_id,
            body.listing_id,
            JSON.stringify(body.submission_links),
            body.tweet_link || null,
            body.additional_info || null,
            body.wallet_address
        ];

        const [result] = await connection.execute(query, values);

        // 7. Fetch the newly created submission
        const [newSubmission] = await connection.execute(
            `SELECT bs.*, u.username 
            FROM bounty_submissions bs 
            JOIN users u ON bs.user_id = u.id 
            WHERE bs.id = ?`,
            [(result as any).insertId]
        );

        return NextResponse.json({
            message: "Submission added successfully",
            submission: newSubmission[0]
        });

    } catch (error) {
        console.error("Error handling submission:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}