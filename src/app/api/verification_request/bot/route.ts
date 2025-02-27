import { Bot, webhookCallback } from "grammy";
import { createConnection } from "@/lib/db";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// 1. Initialize bot with token
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

const bot = new Bot(token);

// 2. Handle incoming messages
bot.on("message:text", async (ctx) => {
  const message = ctx.message.text;
  const username = ctx.message.from.username;
  
  if (!username) {
    await ctx.reply("Please set a Telegram username before verifying.");
    return;
  }

  let connection;
  try {
    connection = await createConnection();
    
    // 3. Check verification code
    const [verificationRows]: any = await connection.execute(
      `SELECT 
        user_id, 
        created_at 
      FROM verification_requests 
      WHERE telegram_username = ? 
      AND verification_code = ? 
      AND verified_at IS NULL
      AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
      [username, message]
    );

    if (verificationRows.length === 0) {
      await ctx.reply("Invalid or expired verification code. Please try again.");
      return;
    }

    const userId = verificationRows[0].user_id;

    // 4. Begin transaction for updating user and verification status
    await connection.query('START TRANSACTION');

    try {
      // 5. Update user's telegram username
      await connection.execute(
        `UPDATE users 
        SET tg_username = ? 
        WHERE id = ?`,
        [username, userId]
      );

      // 6. Mark verification request as verified
      await connection.execute(
        `UPDATE verification_requests 
        SET verified_at = CURRENT_TIMESTAMP 
        WHERE telegram_username = ? 
        AND verification_code = ?`,
        [username, message]
      );

      // 7. Commit transaction
      await connection.query('COMMIT');
      
      await ctx.reply("✅ Your Telegram account has been successfully verified!");
    } catch (error) {
      // 8. Rollback on error
      await connection.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error:', error);
    await ctx.reply("❌ An error occurred during verification. Please try again.");
  }
});

// 9. Export webhook handler
export const POST = webhookCallback(bot, "std/http");