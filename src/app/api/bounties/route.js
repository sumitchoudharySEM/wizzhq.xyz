export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  let connection;

  try {
    connection = await createConnection();

    // Updated query to select only specific fields from listings and join with partner data
    const [listings] = await connection.query(`
      SELECT 
        l.id,
        l.title,
        l.slug,
        l.creator_id,
        l.verified,
        l.categories,
        l.location,
        l.reward,
        l.type,
        l.partner_id,
        l.end_date,
        l.short_description,
        p.name AS partner_name,
        p.profile_photo_url AS partner_profile_photo_url
      FROM listings l
      LEFT JOIN partners p ON l.partner_id = p.id
    `);

    if (listings.length === 0) {
      return NextResponse.json({ listings: null });
    }

    if (listings.length === 0) {
      return NextResponse.json({ listings: null });
    }

    //arrange the listings in order listing.end_date soon to later
    await listings.sort((a, b) => {
      const endDateA = new Date(a.end_date);
      const endDateB = new Date(b.end_date);
      const now = new Date();

      if (endDateA < now && endDateB < now) {
        return endDateB - endDateA;
      } else if (endDateA < now) {
        return 1;
      } else if (endDateB < now) {
        return -1;
      } else {
        return endDateA - endDateB;
      }
    });

    // return all listings
    return NextResponse.json({ listings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
