import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    let connection;
    try {
        const url = new URL(request.url);
        const listingId = url.searchParams.get("listing_id");

        console.log('Fetching comments for listing_id:', listingId);

        if (!listingId) {
            return NextResponse.json(
                { error: "listing_id is required" },
                { status: 400 }
            );
        }

        connection = await createConnection();

        // 1. Get the authenticated user details
        const session = await auth();
        const currentUserId = session?.user?.id;

        // 2. Fetch auth user details if logged in
        let authUser = null;
        if (currentUserId) {
            const [authUserDetails] = await connection.query(`
                SELECT id, name, image
                FROM users
                WHERE id = ?
            `, [currentUserId]);

            if (authUserDetails.length > 0) {
                authUser = authUserDetails[0];
            }
        }

        // 3. Query to fetch comments with nested replies, user information, and reaction counts
        const [comments] = await connection.query(`
            SELECT 
                c.id AS comment_id,
                c.comment_text,
                c.created_at AS comment_created_at,
                c.user_id,
                cu.name AS commenter_name,
                cu.image AS commenter_image,
                (
                    SELECT CONCAT('[', 
                        GROUP_CONCAT(
                            JSON_OBJECT(
                                'reply_id', r.id,
                                'reply_text', r.reply_text,
                                'created_at', r.created_at,
                                'user_id', r.user_id,
                                'user_name', ru.name,
                                'user_image', ru.image,
                                'like_count', (
                                    SELECT COUNT(*) 
                                    FROM reactions react 
                                    WHERE react.target_id = r.id 
                                    AND react.target_type = 'reply'
                                    AND react.reaction_type = 'like'
                                ),
                                'dislike_count', (
                                    SELECT COUNT(*) 
                                    FROM reactions react 
                                    WHERE react.target_id = r.id 
                                    AND react.target_type = 'reply'
                                    AND react.reaction_type = 'dislike'
                                )
                            )
                        ), 
                    ']')
                    FROM replies r
                    LEFT JOIN users ru ON r.user_id = ru.id
                    WHERE r.comment_id = c.id
                ) AS replies,
                (
                    SELECT COUNT(*) 
                    FROM reactions r 
                    WHERE r.target_id = c.id 
                    AND r.target_type = 'comment'
                    AND r.reaction_type = 'like'
                ) AS like_count,
                (
                    SELECT COUNT(*) 
                    FROM reactions r 
                    WHERE r.target_id = c.id 
                    AND r.target_type = 'comment'
                    AND r.reaction_type = 'dislike'
                ) AS dislike_count
            FROM comments c
            LEFT JOIN users cu ON c.user_id = cu.id
            WHERE c.listing_id = ?
            ORDER BY c.created_at DESC
        `, [listingId]);

        // 4. Process comments and parse replies
        const processedComments = comments.map((comment: any) => {
            // a. Parse replies JSON
            const replies = comment.replies
                ? JSON.parse(comment.replies).map((reply: any) => ({
                    ...reply,
                    created_at: new Date(reply.created_at).toLocaleString(),
                    like_count: parseInt(reply.like_count, 10),
                    dislike_count: parseInt(reply.dislike_count, 10)
                }))
                : [];

            return {
                comment_id: comment.comment_id,
                comment_text: comment.comment_text,
                comment_created_at: new Date(comment.comment_created_at).toLocaleString(),
                user: {
                    id: comment.user_id,
                    name: comment.commenter_name,
                    image: comment.commenter_image
                },
                like_count: comment.like_count,
                dislike_count: comment.dislike_count,
                replies: replies
            };
        });

        // 5. If there's an authenticated user, get their reactions too
        if (currentUserId) {
            const [userReactions] = await connection.query(`
                SELECT target_id, reaction_type, target_type
                FROM reactions
                WHERE user_id = ?
                AND target_type IN ('comment', 'reply')
                AND target_id IN (
                    ${processedComments.length > 0 
                        ? processedComments.map((c: { comment_id: number }) => c.comment_id).join(',') 
                        : '0'
                    },
                    ${processedComments.flatMap((c: any) => 
                        c.replies.map((r: any) => r.reply_id)
                    ).length > 0 
                        ? processedComments.flatMap((c: any) => 
                            c.replies.map((r: any) => r.reply_id)
                          ).join(',')
                        : '0'
                    }
                )
            `, [currentUserId]);

            // a. Create a map of target_id to reaction_type
            const reactionMap = new Map(
                userReactions.map((r: { target_id: number, reaction_type: string, target_type: string }) => 
                    [`${r.target_type}_${r.target_id}`, r.reaction_type]
                )
            );

            // b. Add user's reaction to each comment and reply
            processedComments.forEach((comment: any) => {
                comment.userReaction = reactionMap.get(`comment_${comment.comment_id}`) || null;
                
                comment.replies.forEach((reply: any) => {
                    reply.userReaction = reactionMap.get(`reply_${reply.reply_id}`) || null;
                });
            });
        }

        return NextResponse.json({
            comments: processedComments,
            authUser
        });

    } catch (error) {
        console.error('Error in comments route:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } 
}

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
        const { listing_id, comment_text } = body;

        // 4. Validate input
        if (!listing_id || !comment_text) {
            return NextResponse.json(
                { error: "listing_id and comment_text are required" },
                { status: 400 }
            );
        }

        connection = await createConnection();

        // 5. Insert comment
        const [result] = await connection.query(`
            INSERT INTO comments 
            (listing_id, user_id, comment_text, created_at) 
            VALUES (?, ?, ?, NOW())
        `, [listing_id, currentUserId, comment_text]);

        return NextResponse.json(
            { comment_id: result.insertId },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error in create comment route:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } 
}