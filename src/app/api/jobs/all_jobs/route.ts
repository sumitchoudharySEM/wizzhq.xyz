export const dynamic = "force-dynamic";

import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let connection;

  try {
    connection = await createConnection();

    const [jobs] = await connection.query("SELECT * FROM jobs");

    if (jobs.length === 0) {
      return NextResponse.json({ listings: null });
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
