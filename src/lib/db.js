import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

let pool;

export function createConnection() {
  console.log("Connecting to database at:", process.env.DATABASE_HOST);

  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10, // A reasonable limit to avoid overload
        queueLimit: 0, // No queue limit
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000, // Ensures long-lived connections
      });

      console.log("Database connection pool created successfully.");
    } catch (error) {
      console.error("Failed to create database connection pool:", error);
      throw error;
    }
  }

  return pool;
}

export async function getUserByEmail(email) {
  const pool = await createConnection();
  const query = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.query(query, [email]);
  return rows[0];
}

export async function findUserByUsername(username) {
  const pool = await createConnection();
  const query = "SELECT * FROM users WHERE username = ?";
  const [rows] = await pool.query(query, [username]);
  return rows[0];
}

export async function getUserById(userId) {
  const pool = await createConnection();
  const query = "SELECT * FROM users WHERE id = ?";
  const [user] = await pool.query(query,[userId] );
  return user[0];
}

export async function createUserInDB(user) {

  console.error("trying to insert user" + user + user.email)
  let pool = await createConnection();
  let username = user.email.split("@")[0].replace(/\./g, "");
  let finalUsername = username;
  let count = 1;
  while (await findUserByUsername(finalUsername)) {
    // Step 3: Append a number if username exists
    finalUsername = `${username}${count}`;
    count += 1;
  }

  try {
    console.error("trying to insert user st2" + user + user.email)
    const query = "INSERT INTO users (email, username, name, image) VALUES (?, ?, ?, ?)";
const [result] = await pool.query(query, [
  user.email,
  finalUsername,
  user.name,
  user.image,
]);
    return { ...user, user_id: result.insertId }; // Include the newly generated user ID
  } catch (error) {
    console.error("Error during user creation:", error);
    throw error; // Throw error to handle at a higher level if needed
  }
}
