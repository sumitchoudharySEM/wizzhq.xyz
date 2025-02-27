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

        const [submissions] = await connection.query(
            `SELECT 
                bs.listing_id,
                bs.submission_links,
                JSON_EXTRACT(bs.reward, '$.value') as submission_reward,
                l.title,
                l.slug,
                JSON_EXTRACT(l.reward, '$.token') as token,
                p.name,
                p.username,
                p.profile_photo_url
            FROM users u
            JOIN bounty_submissions bs ON u.id = bs.user_id
            JOIN listings l ON bs.listing_id = l.id
            JOIN partners p ON l.partner_id = p.id
            WHERE u.username = ?`,
            [username]
        );

        // console.log(submissions);

        return NextResponse.json({ submissions });

    } catch (error) {
        console.error("Error fetching user submissions:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } 
}