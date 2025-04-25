"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { userDetailContext } from "./_context/userDetailContext";

const Provider = ({ children }) => {
  const { user } = useUser(); // Clerk hook to get the current user
  const [userDetail, setUserDetail] = useState(null); // Default state is null

  const verifyUser = async () => {
    try {
      if (user) {
        // ✅ Sending userData to the API endpoint (not just 'user')
        const { data } = await axios.post("/api/verify-user", { userData: user });

        console.log("✅ VerifyUser response:", data.result);
        setUserDetail(data.result); // Update user context with the result
      }
    } catch (error) {
      console.error("❌ Error verifying user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      verifyUser(); // Trigger verifyUser function whenever user changes
    }
  }, [user]);

  return (
    <userDetailContext.Provider value={userDetail}>
      <div>{children}</div>
    </userDetailContext.Provider>
  );
};

export default Provider;
