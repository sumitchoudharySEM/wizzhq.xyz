"use client";
// UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const UserContext = createContext({ user: null });

export const UserProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await fetch(`/api/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setUser(data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
