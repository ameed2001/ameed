// src/db/connect.ts
import { MongoClient, type Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  if (!MONGODB_URI) {
    console.error("[db/connect.ts] MONGODB_URI is not defined in environment variables.");
    return { client: null, db: null };
  }
  if (!MONGODB_DB_NAME) {
    console.error("[db/connect.ts] MONGODB_DB_NAME is not defined in environment variables.");
    return { client: null, db: null };
  }

  if (cachedClient && cachedDb) {
    try {
      // Ping the database to check if the connection is still alive
      await cachedClient.db(MONGODB_DB_NAME).command({ ping: 1 });
      console.log("[db/connect.ts] Using cached MongoDB connection.");
      return { client: cachedClient, db: cachedDb };
    } catch (e) {
      console.warn("[db/connect.ts] Cached MongoDB connection lost. Reconnecting...", e);
      cachedClient = null;
      cachedDb = null;
    }
  }

  let client: MongoClient;
  try {
    client = new MongoClient(MONGODB_URI);
    console.log("[db/connect.ts] Attempting to connect to MongoDB...");
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);

    cachedClient = client;
    cachedDb = db;

    console.log("[db/connect.ts] Successfully connected to MongoDB and database:", MONGODB_DB_NAME);
    return { client, db };
  } catch (error) {
    console.error("[db/connect.ts] Failed to connect to MongoDB:", error);
    // Attempt to close client if it was instantiated but failed to connect fully
    if (client! && typeof client!.close === 'function') { // client! to assert client is assigned
      try {
        await client!.close();
        console.log("[db/connect.ts] MongoDB client closed due to connection error.");
      } catch (closeError) {
        console.error("[db/connect.ts] Error closing MongoDB client after connection failure:", closeError);
      }
    }
    cachedClient = null; 
    cachedDb = null;
    return { client: null, db: null };
  }
}

export { type Db as MongoDb, type Collection, ObjectId } from 'mongodb';
