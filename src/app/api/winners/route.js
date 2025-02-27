export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

//get request to fetch winners data of corressponding listing_id and from winners data get the user_id details of corressponding winner_id
export async function GET(request) {
  let connection;
  const url = new URL(request.url);
  const listing_id = url.searchParams.get("listing");

  try {
    if (!listing_id) {
      return NextResponse.json({ error: "No listing found" }, { status: 400 });
    }

    connection = await createConnection();

    // Query to get winners with user details
    const [winnersWithUsers] = await connection.query(
      `
          SELECT 
            s.id,
            s.listing_id,
            s.user_id,
            s.reward,
            s.submission_links,
            s.wallet_address,
            u.id as user_id,
            u.name as user_name,
            u.username as user_username,
            u.image as user_image
          FROM bounty_submissions s
          LEFT JOIN users u ON s.user_id = u.id
          WHERE s.listing_id = ? AND s.reward IS NOT NULL
      `,
      [listing_id]
    );

    if (!winnersWithUsers || winnersWithUsers.length === 0) {
      return NextResponse.json({ message: "No winners found" });
    }

    return NextResponse.json({ winners: winnersWithUsers });
  } catch (error) {
    console.error("Error retrieving winners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let connection;

  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { listing_id, winners } = body;

    if (!listing_id || !winners || !Array.isArray(winners) || winners.length === 0) {
      return NextResponse.json(
        { error: "listing_id and winners array are required" },
        { status: 400 }
      );
    }

    connection = await createConnection();

    try {
      // Fetch the listing and verify creator
      const [listings] = await connection.query(
        "SELECT * FROM listings WHERE id = ?",
        [listing_id]
      );

      if (listings.length === 0) {
        return NextResponse.json(
          { error: "Listing not found" },
          { status: 404 }
        );
      }

      const listing = listings[0];

      // Check if user is admin
      const [adminRows] = await connection.query(
        'SELECT * FROM admins WHERE user_email = ?',
        [session.user.email]
      );
      const isAdmin = Array.isArray(adminRows) && adminRows.length > 0;

      // If user is not an admin and not the creator, deny access
      if (!isAdmin && listing.creator_id !== session.user.id) {
        return NextResponse.json(
          { error: "Unauthorized - Only the listing creator or an admin can assign prizes" },
          { status: 403 }
        );
      }

      const listingReward = JSON.parse(listing.reward);
      const tokenName = listingReward.token;

      // Validate prize assignments
      const rewardData = JSON.parse(listing.reward);
      const { prizes: numberedPrizes, bonusPrize } = rewardData;

      const submittedNumberedPrizes = winners.filter(w => w.type === 'numbered').length;
      const submittedBonusPrizes = winners.filter(w => w.type === 'bonus').length;

      if (submittedNumberedPrizes !== numberedPrizes.length) {
        return NextResponse.json({
          error: "Incorrect number of numbered prizes assigned",
          expected: numberedPrizes.length,
          received: submittedNumberedPrizes
        }, { status: 500 });
      }

      // Fetch user details for all winners
      const userIds = winners.map(w => w.user_id);
      const [users] = await connection.query(
        "SELECT id, email, name FROM users WHERE id IN (?)",
        [userIds]
      );

      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      // Insert winners with enhanced reward structure
      for (const winner of winners) {
        const rewardData = {
          value: winner.reward,
          type: winner.type,
          ...(winner.type === 'numbered' ? { position: winner.position } : {})
        };

        await connection.query(
          "UPDATE bounty_submissions SET reward = ? WHERE listing_id = ? AND user_id = ?",
          [
            JSON.stringify(rewardData),
            listing_id,
            winner.user_id
          ]
        );
      }

      await connection.query(
        "UPDATE listings SET rewarded_on = NOW() WHERE id = ?",
        [listing_id]
      );

      // Prepare data for email notifications
      const emailData = {
        winners: winners.map(winner => ({
          email: userMap[winner.user_id].email,
          name: userMap[winner.user_id].name,
          reward: `${winner.reward} ${tokenName}`,
          position: winner.type === 'numbered' 
            ? `${winner.position}${getOrdinalSuffix(winner.position)} Place`
            : 'Bonus Prize'
        })),
        bountyDetails: {
          bountyTitle: listing.title,
          bountyLink: `${process.env.NEXTAUTH_URL}/bounties/${listing.slug}`
        }
      };

      // console.log('Email data:', emailData);

      // Send email notifications
      const emailResponse = await fetch('https://wizzhq.xyz/api/mail/winners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!emailResponse.ok) {
        console.error('Failed to send winner notification emails');
      }

      return NextResponse.json({
        success: true,
        message: "All winners added successfully",
        totalWinners: winners.length
      });

    } catch (error) {
      console.error("Database operation error:", error);
      throw error;
    }

  } catch (error) {
    console.error("Error in announce winner API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } 
}

// helper func to get ordinal suffix
function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j == 1 && k != 11) {
    return "st";
  }
  if (j == 2 && k != 12) {
    return "nd";
  }
  if (j == 3 && k != 13) {
    return "rd";
  }
  return "th";
}