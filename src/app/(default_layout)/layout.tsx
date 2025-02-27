"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import DefaultFooter from "@/components/level_one_layout/default_footer";
import DefaultNavbar from "@/components/level_one_layout/default_navbar.jsx";
import DefaultSidebar from "@/components/level_one_layout/default_sidebar.jsx";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar hidden on small screens */}
      <div className="hidden md:flex">
        <DefaultSidebar />
      </div>

      <div className="flex flex-col flex-grow w-full">
        {/* Navbar is always visible */}
        <DefaultNavbar />

        <main className="flex-grow bg-[#F8FAFC] pb-24 min-h-[90vh]">{children}</main>

        {/* Footer is always visible */}
        <div className="-mt-4">
          <DefaultFooter />
        </div>
      </div>
    </div>
  );
}
