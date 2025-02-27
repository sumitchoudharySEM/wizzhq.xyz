"use client";

import { useState, useEffect } from "react";
import PartnerSidebar from "@/components/level_one_layout/partner_sidebar";
import PartnerNavbar from "@/components/level_one_layout/partner_navbar.jsx";
import DefaultFooter from "@/components/level_one_layout/default_footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [pageWidth, setPageWidth] = useState("100vw"); // default value for small screens

  // useEffect(() => {
  //   // Function to update width based on window size
  //   const updatePageWidth = () => {
  //     if (window.innerWidth >= 768) { //md
  //       setPageWidth("86vw");
  //     } else {
  //       setPageWidth("100vw");
  //     }
  //   };

  //   // Initial check & resize listener on change in width of window
  //   updatePageWidth();

  //   window.addEventListener("resize", updatePageWidth);

  //   // Cleanup
  //   return () => window.removeEventListener("resize", updatePageWidth);
  // }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar hidden on small screens */}
        <div className="hidden md:flex">
          <PartnerSidebar />
        </div>

        <div
          className="flex flex-col flex-grow"
          // style={{ maxWidth: pageWidth }}
        >
          {/* Navbar is always visible */}
          <PartnerNavbar />

          <main className="flex-grow overflow-auto bg-[#F8FAFC] pb-12">
            <div className="px-4 md:px-8 lg:px-12">{children}</div>
          </main>

          {/* Default Footer */}
          <div className="-mt-4">
          <DefaultFooter />
          </div>
        </div>
      </div>
    </>
  );
}
