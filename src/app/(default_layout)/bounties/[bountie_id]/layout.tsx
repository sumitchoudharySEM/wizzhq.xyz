import BountyLayout from "@/components/bounties/bounties_layout";
import type { Metadata } from "next";
import Image from "next/image";

async function getBountyData(bountyId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/bounty?slug=${bountyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data.listing;
  } catch (error) {
    console.error("Error fetching listing data:", error);
    return null;
  }
}

// Function to fetch partner data
async function getPartnerData(partnerId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/partners_listing/partner?id=${partnerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data.partner;
  } catch (error) {
    console.error("Error fetching partner data:", error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: { bountie_id: string };
}): Promise<Metadata> {
  const bountyData = await getBountyData(params.bountie_id);
  const partnerData = bountyData?.partner_id
    ? await getPartnerData(bountyData.partner_id)
    : null;

  // Parse rewards
  let r1 = "",
    r2 = "",
    r3 = "",
    pb = "";
  let token = "";

  if (bountyData?.reward) {
    const rewards = JSON.parse(bountyData.reward);
    token = rewards.token || "";

    // Get main prizes
    if (rewards.prizes) {
      r1 = rewards.prizes[0]?.toString() || "";
      r2 = rewards.prizes[1]?.toString() || "";
      r3 = rewards.prizes[2]?.toString() || "";

      // Calculate remaining prizes pool
      const remainingPrizes = rewards.prizes
        .slice(3)
        .reduce((sum: number, prize: number) => sum + prize, 0);

      // Calculate bonus prize pool
      const bonusTotal =
        rewards.bonusPrize &&
        rewards.bonusPrize.amount &&
        rewards.bonusPrize.number
          ? parseFloat(rewards.bonusPrize.amount) *
            parseFloat(rewards.bonusPrize.number)
          : 0;

      // Only set pb if total pool is greater than 0
      const totalPool = remainingPrizes + bonusTotal;
      if (totalPool > 0) {
        pb = totalPool.toString();
      }
    }
  }

  // Create URLSearchParams and properly encode each parameter
  const queryParams = new URLSearchParams();

  // Add parameters only if they exist and encode them
  if (bountyData?.title)
    queryParams.set("title", encodeURIComponent(bountyData.title));
  if (partnerData?.profile_photo_url)
    queryParams.set("plogo", encodeURIComponent(partnerData.profile_photo_url));
  if (partnerData?.name)
    queryParams.set("pname", encodeURIComponent(partnerData.name));
  if (bountyData?.type)
    queryParams.set("type", encodeURIComponent(bountyData.type));
  queryParams.set(
    "location",
    encodeURIComponent(bountyData?.location || "Global")
  );

  // Add prize parameters with token
  if (r1) queryParams.set("r1", encodeURIComponent(`${r1} ${token}`));
  if (r2) queryParams.set("r2", encodeURIComponent(`${r2} ${token}`));
  if (r3) queryParams.set("r3", encodeURIComponent(`${r3} ${token}`));
  if (pb) queryParams.set("pb", encodeURIComponent(`${pb} ${token}`));

  // Create the final encoded URL
  const encodedUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/og/bounty?${queryParams.toString()}`;

  return {
    title: bountyData?.title
      ? `${bountyData?.title} | Wizz`
      : "Bounty Details | Wizz",
    description:
      bountyData?.description || "View and participate in bounties on Wizz",
    // openGraph: {
    //   images: [
    //     {
    //       url: encodedUrl,
    //       width: 1200,  // Recommended size for wider compatibility
    //       height: 630,  // Recommended size for wider compatibility
    //       alt: bountyData?.title || 'Bounty Image',
    //     }
    //   ],
    //   title: bountyData?.title ? `${bountyData.title} | Wizz` : 'Bounty Details | Wizz',
    //   description: bountyData?.description || 'View and participate in bounties on Wizz',
    //   url: `${process.env.NEXT_PUBLIC_BASE_URL}/bounties/${bountyData.slug}`,
    //   type: 'website',
    //   siteName: 'Wizz',
    // },
    openGraph: {
      images: [encodedUrl],
      title: bountyData?.title
        ? `${bountyData.title} | Wizz`
        : "Bounty Details | Wizz",
      description:
        bountyData?.description || "View and participate in bounties on Wizz",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/bounties/${bountyData?.slug}`,
      type: "website",
      siteName: "Wizz",
    },
    twitter: {
      card: "summary_large_image",
      title: bountyData?.title
        ? `${bountyData?.title} | Wizz`
        : "Bounty Details | Wizz",
      description:
        bountyData?.description || "View and participate in bounties on Wizz",
      images: [encodedUrl],
    },
    other: {
      "og:image:secure_url": encodedUrl,
      "og:url": `${process.env.NEXT_PUBLIC_BASE_URL}/bounties/${params.bountie_id}`,
      // WhatsApp specific
      "og:image:type": "image/png",
      // Telegram specific
      "telegram:image": encodedUrl,
      "telegram:card": "summary_large_image",
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BountyLayout>{children}</BountyLayout>;
}
