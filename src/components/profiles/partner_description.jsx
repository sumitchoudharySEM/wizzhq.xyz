"use client"

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ProfilePage() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchPartnerData = async () => {
      const partnerUsername = pathname.split("/")[3];
      try {
        const response = await fetch(`/api/partners?username=${partnerUsername}`);
        if (response.ok) {
          const data = await response.json();
          setPartner(data);
        } else {
          setError("Failed to fetch partner data");
        }
      } catch (error) {
        console.error("An error occurred while fetching partner data:", error);
        setError("An error occurred while fetching partner data");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, [pathname]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!partner) return <div>No partner data available</div>;

  return (
    <div className="py-3 px-4">
      <p className="text-gray-700 leading-relaxed">
      {partner.partner.description || "No description available"}
      </p>
    </div>
  );
}
