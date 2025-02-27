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
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Parse query parameters
        const { searchParams } = new URL(request.url);
        const submission_id = searchParams.get("submission_id");
        const user_id = searchParams.get("user_id");

        if (!submission_id || !user_id) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        connection = await createConnection();

        // 3. Check whether the user is an admin
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

        // 4. Fetch points for the given submission_id and user_id
        const [pointsRows] = await connection.execute(
            `SELECT points FROM participation_points 
             WHERE submission_id = ? AND user_id = ?`,
            [submission_id, user_id]
        );

        // 5. If no points are found, return an empty value
        if (!Array.isArray(pointsRows) || pointsRows.length === 0) {
            return NextResponse.json({
                message: "No points found for this submission and user",
                data: {
                    submission_id,
                    user_id,
                    points: null, // Return null if no points are found
                },
            });
        }

        const points = pointsRows[0].points;

        return NextResponse.json({
            message: "Points fetched successfully",
            data: {
                submission_id,
                user_id,
                points,
            },
        });

    } catch (error) {
        console.error('Error fetching points:', error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
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
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Parse request body
        const body = await request.json();
        const { submission_id, points } = body;

        if (!submission_id || !points) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        connection = await createConnection();

        // 3. Check whether the user is an admin
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

        // 4. Get submission details and assign submission_type and user_id
        const [submissionRows] = await connection.execute(
            `SELECT 
                (SELECT 'bounty' FROM bounty_submissions WHERE id = ?) as submission_type,
                COALESCE(
                    (SELECT user_id FROM bounty_submissions WHERE id = ?),
                    NULL
                ) as user_id`,
            [submission_id, submission_id]
        );

        //we can use this whenever we have job_submissions table available
        // SELECT
        // COALESCE(
        //     (SELECT 'bounty' FROM bounty_submissions WHERE id = ?),
        //     (SELECT 'job' FROM job_submissions WHERE id = ?),
        // NULL
        // ) as submission_type,
        // COALESCE(
        //     (SELECT user_id FROM bounty_submissions WHERE id = ?),
        //     (SELECT user_id FROM job_submissions WHERE id = ?),
        // NULL
        // ) as user_id

        if (!submissionRows[0]?.submission_type || !submissionRows[0]?.user_id) {
            return NextResponse.json(
                { error: "Invalid submission ID" },
                { status: 404 }
            );
        }

        const { submission_type, user_id } = submissionRows[0];

        // 5. Check if points have already been assigned for this submission
        const [existingPoints] = await connection.execute(
            `SELECT points FROM participation_points 
            WHERE submission_id = ? AND submission_type = ? AND user_id = ? AND type = 0`,
            [submission_id, submission_type, user_id]
        );

        if (Array.isArray(existingPoints) && existingPoints.length > 0) {
            return NextResponse.json({
                message: "Points already assigned",
                data: {
                    submission_id,
                    submission_type,
                    user_id,
                    points: existingPoints[0].points,
                    already_assigned: true
                }
            });
        }

        // 6. Check if the user was referred by someone
        const [referralRows] = await connection.execute(
            'SELECT user_refered_id FROM refrel_points WHERE user_joined_id = ?',
            [user_id]
        );

        try {
            // Start transaction
            await connection.query('START TRANSACTION');

            // a. Insert direct participation points for the submission maker
            await connection.execute(
                `INSERT INTO participation_points 
                (submission_id, submission_type, user_id, points, type, claimed, point_given_on) 
                VALUES (?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP)`,
                [submission_id, submission_type, user_id, points]
            );

            // b. If user was referred, give referral points to the referrer
            if (Array.isArray(referralRows) && referralRows.length > 0) {
                const referrerId = referralRows[0].user_refered_id;
                const referralPoints = Math.floor(points * 0.2); // 20% of the original points

                await connection.execute(
                    `INSERT INTO participation_points 
                    (submission_id, submission_type, user_id, points, type, claimed, point_given_on) 
                    VALUES (?, ?, ?, ?, 1, 0, CURRENT_TIMESTAMP)`,
                    [submission_id, submission_type, referrerId, referralPoints]
                );
            }

            await connection.query('COMMIT');

            return NextResponse.json({
                message: "Participation points assigned successfully",
                data: {
                    submission_id,
                    submission_type,
                    user_id,
                    points,
                    has_referral: Array.isArray(referralRows) && referralRows.length > 0,
                    already_assigned: false
                }
            });

        } catch (transactionError) {
            // c. If there's an error during transaction, roll it back
            await connection.query('ROLLBACK');
            throw transactionError;
        }

    } catch (error) {
        console.error('Error in assigning participation points:', error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } 
}

