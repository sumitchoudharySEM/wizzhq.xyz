import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
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

        // 4. Get the slug from request body
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json(
                { error: "Slug is required" },
                { status: 400 }
            );
        }

        // 5. Get current verification status
        const [listingRows] = await connection.execute(
            'SELECT verified, partner_id, title FROM listings WHERE slug = ?',
            [slug]
        );

        if (!Array.isArray(listingRows) || listingRows.length === 0) {
            return NextResponse.json(
                { error: "Listing not found" },
                { status: 404 }
            );
        }

        const { verified: currentStatus, partner_id, title: bountyTitle } = listingRows[0];
        
        // 6. Toggle verification status (0 to 1 or 1 to 0)
        const newStatus = currentStatus === 0 ? 1 : 0;

        // 7. Update the verification status
        await connection.execute(
            'UPDATE listings SET verified = ? WHERE slug = ?',
            [newStatus, slug]
        );

        // 8. send email only when it is being verified i.e from 0 to 1
        if (newStatus === 1) {
            const [partnerRows] = await connection.execute(
                'SELECT name, email FROM partners WHERE id = ?',
                [partner_id]
            );

            if (Array.isArray(partnerRows) && partnerRows.length > 0) {
                const { name, email } = partnerRows[0];
                const bountyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/bounties/${slug}`;

                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mail/verified_bounty`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: email,
                        subject: 'Congrats🎉! Your bounty has been verified',
                        name: name,
                        bountyTitle: bountyTitle,
                        bountyLink: bountyLink
                    })
                });
            }
        }

        return NextResponse.json({
            message: `Bounty ${newStatus === 1 ? 'verified' : 'unverified'} successfully`,
            newStatus: newStatus
        });

    } catch (error) {
        console.error('Error in toggling verification status:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } 
}