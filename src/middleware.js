import { auth } from "../auth";
import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

export default auth(async (req) => {
  try {
    console.log("middleware running");
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // console.log("Token:", token);
    const session = await auth();
    const userid = session?.user?.id;
    const { pathname } = req.nextUrl;
    const baseUrl = req.nextUrl.origin;

    // Define protected paths and auth paths
    const protectedPaths = ["/dashboard", "/edit", "/become_partner", "/admin"];
    const authPaths = ["/signin"];
    const dashboardPaths = ["/dashboard"];
    const adminPaths = ["/admin"];

    // Check if the current path starts with any protected path
    const isProtectedPath = protectedPaths.some(
      (path) =>
        pathname.startsWith(path) || // Matches /dashboard/* and /edit/*
        /^\/[^\/]+\/edit/.test(pathname) // Matches /[user_id]/edit
    );

    // Check if current path is admin path
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

    // Check if the current path is an auth path
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
    const isDashboardPath = dashboardPaths.some((path) =>
      pathname.startsWith(path)
    );

    // Redirect authenticated users trying to access auth pages
    if (isAuthPath && userid) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Redirect unauthenticated users trying to access protected paths
    if (isProtectedPath && !userid) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Handle authenticated user routes
    if (userid) {
      
      console.log("middleware running under if user authnticated");
      try {
        const userRes = await fetch(`${baseUrl}/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.get("cookie") || "",
          },
          credentials: "include",
        });

        console.log("User Response Status:", userRes.status); // Debug log

        if (!userRes.ok) {
          console.error("Failed to fetch user data:", await userRes.text());
          return NextResponse.redirect(new URL("/", req.url));
        }
        const data = await userRes.json();
        console.log("User Data:", data); // Debug log

        if (!data.user) {
          return NextResponse.redirect(new URL("/signin", req.url));
        }

        // Handle dashboard routes
        if (isDashboardPath) {
          if (data.user.is_partner === 0) {
            return NextResponse.redirect(new URL("/become_partner", req.url));
          } else if (data.user.is_partner === 1) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            new URL("/info_page/onepartner", req.url)
          );
        }

        // Handle /become_partner route
        if (pathname === "/become_partner") {
          if (data.user.is_partner === 0) {
            return NextResponse.next();
          } else {
            return NextResponse.redirect(
              new URL("/info_page/onepartner", req.url)
            );
          }
        }

        // Check if user is admin for admin paths
        if (isAdminPath) {
          try {
            const adminResult = await fetch(`${baseUrl}/api/admin/checkadmin`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Cookie: req.headers.get("cookie") || "",
              },
              credentials: "include",
            });
        
            if (!adminResult.ok) {
              console.error("Failed to fetch admin data:", await adminResult.text());
              return NextResponse.redirect(new URL("/", req.url));
            }
        
            const adminData = await adminResult.json();
            console.log("Admin check response:", adminData);
        
            if (!adminData.admin) {
              return NextResponse.redirect(new URL("/", req.url));
            }
        
            // User is admin, allow access
            return NextResponse.next();
          } catch (error) {
            console.error("Error checking admin status:", error);
            return NextResponse.redirect(new URL("/", req.url));
          }
        }

        
      } catch (error) {
        console.error("Error in middleware:", error);
        return NextResponse.redirect(new URL("/error", req.url));
      }
    } else {
      // Handle unauthenticated users for specific routes
      if (pathname === "/become_partner" || isDashboardPath || isAdminPath) {
        return NextResponse.redirect(new URL("/signin", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.error();
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/:path*/edit",
    "/signin",
    "/become_partner",
    "/api/:path*",
    "/admin/:path*",
  ],
};
