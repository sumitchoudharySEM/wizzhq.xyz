"use client";

import React from "react";

const Page = () => {
  const handleSendMail = async () => {
    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "sumitsem2004@gmail.com, ram2mar347@gmail.com",
          subject: "Submission Recorded Successfully",
          name: "Nikhil",
          bountyTitle: "Tensorium AI Thread Contest",
          bountyLink: "https://wizzhq.xyz/bounties/tensorium_ai_thread_contest",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
      } else {
        const errorResult = await response.json();
        console.error(errorResult.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email", error);
    }
  };

  return (
    <div>
      <button onClick={handleSendMail}>Send mail</button>
    </div>
  );
};

export default Page;
