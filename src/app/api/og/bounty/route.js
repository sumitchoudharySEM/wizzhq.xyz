/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Properly decode parameters
    const title = decodeURIComponent(
      searchParams.get("title") || "A Great Bounty For You"
    );
    const rawPname = decodeURIComponent(searchParams.get("pname") || "Partner");
    const rawType = decodeURIComponent(searchParams.get("type") || "Bounty");
    const rawLocation = decodeURIComponent(
      searchParams.get("location") || "Global"
    );
    const plogo = searchParams.get("plogo")
      ? decodeURIComponent(searchParams.get("plogo"))
      : null;

    // Change default from "N/A" to empty string to match metadata generation
    const r1 = searchParams.get("r1")
      ? decodeURIComponent(searchParams.get("r1"))
      : "";
    const r2 = searchParams.get("r2")
      ? decodeURIComponent(searchParams.get("r2"))
      : "";
    const r3 = searchParams.get("r3")
      ? decodeURIComponent(searchParams.get("r3"))
      : "";
    const pb = searchParams.get("pb")
      ? decodeURIComponent(searchParams.get("pb"))
      : "";

    const pname = rawPname.charAt(0).toUpperCase() + rawPname.slice(1);
    const type = rawType.charAt(0).toUpperCase() + rawType.slice(1);
    const location = rawLocation.charAt(0).toUpperCase() + rawLocation.slice(1);

    // Fetch font, background image, and prize icons
    const [fontData, fontDataReg, bgImage, p1, p2, p3, pbimage] =
      await Promise.all([
        fetch(
          new URL(
            "../../../../../public/fonts/poppins/Poppins-SemiBold.ttf",
            import.meta.url
          )
        ).then((res) => res.arrayBuffer()),
        fetch(
          new URL(
            "../../../../../public/fonts/poppins/Poppins-Regular.ttf",
            import.meta.url
          )
        ).then((res) => res.arrayBuffer()),
        fetch(
          new URL("../../../../../public/images/og/ogg.png", import.meta.url)
        ).then((res) => res.arrayBuffer()),
        fetch(
          new URL(
            "../../../../../public/images/og/1coin.png",
            import.meta.url
          )
        ).then((res) => res.arrayBuffer()),
        fetch(
          new URL(
            "../../../../../public/images/og/2coin.png",
            import.meta.url
          )
        ).then((res) => res.arrayBuffer()),
        fetch(
          new URL(
            "../../../../../public/images/og/3coin.png",
            import.meta.url
          )
        ).then((res) => res.arrayBuffer()),
        fetch(
          new URL("../../../../../public/images/og/4coin.png", import.meta.url)
        ).then((res) => res.arrayBuffer()),
      ]);

    // Fetch partner logo separately if it exists
    let partnerLogo = null;
    if (plogo) {
      try {
        const response = await fetch(plogo);
        partnerLogo = await response.arrayBuffer();
      } catch (error) {
        console.error("Error fetching partner logo:", error);
      }
    }

    const base64Image = Buffer.from(bgImage).toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "white",
            backgroundImage: `url(${dataUrl})`,
            paddingLeft: "96px",
            paddingTop: "70px",
            paddingRight: "180px",
            paddingBottom: "68px",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {partnerLogo && (
              <img
                src={`data:image/png;base64,${Buffer.from(partnerLogo).toString(
                  "base64"
                )}`}
                width="100"
                height="100"
                style={{ borderRadius: "15px" }}
              />
            )}
            <div
              style={{
                fontSize: "48px",
                fontFamily: "Poppins",
                fontWeight: 500,
                color: "#2A3342",
                lineHeight: 1.1, 
                marginBottom: "-4px",
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                color: "#64748b",
                fontSize: "24px",
                fontFamily: "Poppins",
                fontWeight: 400,
                marginTop: "0px",
                
              }}
            >
              <span>{pname}</span>
              <span>|</span>
              <span>{type}</span>
              <span>|</span>
              <span>{location}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "35px",
              alignItems: "center",
              fontFamily: "Poppins",
              fontWeight: 500,
              lineHeight: 0.8,
            }}
          >
            {r1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={`data:image/png;base64,${Buffer.from(p1).toString(
                    "base64"
                  )}`}
                  width="85"
                  height="85"
                />
                <div
                  style={{
                    color: "#10b981",
                    fontSize: "22px",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                  }}
                >
                  {r1}
                </div>
              </div>
            )}
            {r2 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={`data:image/png;base64,${Buffer.from(p2).toString(
                    "base64"
                  )}`}
                  width="85"
                  height="85"
                />
                <div
                  style={{
                    color: "#10b981",
                    fontSize: "22px",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                  }}
                >
                  {r2}
                </div>
              </div>
            )}
            {r3 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={`data:image/png;base64,${Buffer.from(p3).toString(
                    "base64"
                  )}`}
                  width="85"
                  height="85"
                />
                <div
                  style={{
                    color: "#10b981",
                    fontSize: "22px",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                  }}
                >
                  {r3}
                </div>
              </div>
            )}
            {pb && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={`data:image/png;base64,${Buffer.from(pbimage).toString(
                    "base64"
                  )}`}
                  width="85"
                  height="85"
                />
                <div
                  style={{
                    color: "#10b981",
                    fontSize: "22px",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                  }}
                >
                  {pb}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200, // Changed to recommended OG image size
        height: 630, // Changed to recommended OG image size
        fonts: [
          {
            name: "Poppins",
            data: fontData,
            weight: 500,
            style: "normal",
          },
          {
            name: "Poppins",
            data: fontDataReg,
            weight: 400,
            style: "normal",
          },
        ],
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
