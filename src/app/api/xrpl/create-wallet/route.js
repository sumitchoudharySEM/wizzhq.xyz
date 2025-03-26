export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { auth } from "../../../../../auth"; // Adjust path if needed
const xrpl = require("xrpl");

export async function POST(request) {
  let client;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId = session.user.id;

    const connection = await createConnection();
    const [existingWallets] = await connection.query(
      "SELECT * FROM xrp_wallets WHERE user_id = ?",
      [userId]
    );

    if (existingWallets.length > 0) {
      return NextResponse.json({
        message: "Wallet already exists",
        public_address: existingWallets[0].public_address,
      });
    }

    client = new xrpl.Client("wss://testnet.xrpl-labs.com", {
      connectionTimeout: 10000,
    });

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} to connect to XRPL Testnet`);
        await client.connect();
        console.log("Connected to XRPL Testnet");
        break;
      } catch (connectError) {
        attempts++;
        console.error(`Connection attempt ${attempts} failed: ${connectError.message}`);
        if (attempts === maxAttempts) {
          throw new Error(`Failed to connect after ${maxAttempts} attempts: ${connectError.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const fundResult = await client.fundWallet();
    const wallet = fundResult.wallet;

    await connection.query(
      `INSERT INTO xrp_wallets (user_id, public_address, seed) 
       VALUES (?, ?, ?)`,
      [userId, wallet.address, wallet.seed]
    );

    const balance = await client.getXrpBalance(wallet.address);
    await client.disconnect();

    return NextResponse.json({
      message: "Wallet created successfully",
      public_address: wallet.address,
      balance: balance,
    });
  } catch (error) {
    console.error("Error creating wallet:", error);
    if (client) {
      try {
        await client.disconnect();
      } catch (disconnectError) {
        console.error("Failed to disconnect XRPL client:", disconnectError);
      }
    }
    return NextResponse.json(
      { error: "Failed to create wallet", details: error.message },
      { status: 500 }
    );
  }
}