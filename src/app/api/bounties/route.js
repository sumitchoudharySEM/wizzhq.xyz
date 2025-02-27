export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  let connection;

  try {
    connection = await createConnection();

    const [listings] = await connection.query("SELECT * FROM listings");

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
