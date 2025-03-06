export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let connection;

  try {
    connection = await createConnection();

    const [jobs] = await connection.query(`
      SELECT 
        l.id,
        l.title,
        l.slug,
        l.creator_id,
        l.reward,
        l.verified,
        l.categories,
        l.location,
        l.type,
        l.partner_id,
        l.end_date,
        l.short_description,
        l.payment_type,
        l.fixed_amount,
        l.max_amount,
        l.min_amount,
        p.name AS partner_name,
        p.profile_photo_url AS partner_profile_photo_url
      FROM jobs l
      LEFT JOIN partners p ON l.partner_id = p.id
    `);

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ jobs: [] });
    }

    //arrange the listings in order listing.end_date soon to later
    await jobs.sort((a: any, b: any) => {
      const endDateA = new Date(a.end_date);
      const endDateB = new Date(b.end_date);
      const now = new Date();

      if (endDateA < now && endDateB < now) {
        return endDateB.getTime() - endDateA.getTime();
      } else if (endDateA < now) {
        return 1;
      } else if (endDateB < now) {
        return -1;
      } else {
        return endDateA.getTime() - endDateB.getTime();
      }
    });

    // return all listings
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
