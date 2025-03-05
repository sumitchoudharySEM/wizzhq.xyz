import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import { headers } from "next/headers"; 

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub, Twitter],
  trustHost: true,
  debug: true,
  // secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        console.error("No email provided by OAuth provider");
        return false;
      }

      try {
        // Extract cookies from headers (server-side request)
        // const headerStore = headers();
        // const cookieHeader = headerStore.get("cookie") || "";
        // const referralCode = cookieHeader
        //   .split("; ")
        //   .find((row) => row.startsWith("referralCode="))
        //   ?.split("=")[1];

        // console.log("Referral code extracted from headers:", referralCode);

        // Check if user exists
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users?email=${encodeURIComponent(user.email)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        
        if (!data.user) {
          // Create new user
          const createResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          if (!createResponse.ok) {
            throw new Error('Failed to create user');
          }

          const newUser = await createResponse.json();

          // const requests = [
          //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/points/referral_code`, {
          //     method: "POST",
          //     headers: {
          //     "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({ userId: newUser.user.id }),
          //   }),
          // ];

          // if (referralCode) {
          //   requests.push(
          //     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/points/process_referral`, {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({
          //       userId: newUser.user.id,
          //       referralCode: referralCode,
          //     }),
          //   })
          //   );
          // }

          // await Promise.all(requests).catch(error => {
          //   console.error("Error in parallel operations:", error);
          //   throw new Error("Failed to process referral");
          // });
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/users?email=${encodeURIComponent(session.user.email)}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          if (data.user?.id) {
            session.user.id = data.user.id;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});