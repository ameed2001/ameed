
// src/db/connect.ts
import { MongoClient, type Db as MongoDb } from 'mongodb';
import dotenv from 'dotenv';

// Explicitly load environment variables from .env file
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let cachedClient: MongoClient | null = null;
let cachedDb: MongoDb | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: MongoDb | null }> {
  console.log("[db/connect.ts] Attempting to connect to MongoDB...");

  if (!MONGODB_URI) {
    console.error("--------------------------------------------------------------------");
    console.error("[db/connect.ts] CRITICAL: MONGODB_URI is not defined in environment variables.");
    console.error("Please ensure MONGODB_URI is set in your .env file (e.g., MONGODB_URI=\"mongodb://localhost:27017/mydb\")");
    console.error("--------------------------------------------------------------------");
    return { client: null, db: null };
  }
  if (!MONGODB_DB_NAME) {
    console.error("--------------------------------------------------------------------");
    console.error("[db/connect.ts] CRITICAL: MONGODB_DB_NAME is not defined in environment variables.");
    console.error("Please ensure MONGODB_DB_NAME is set in your .env file (e.g., MONGODB_DB_NAME=\"your_database_name\")");
    console.error("--------------------------------------------------------------------");
    return { client: null, db: null };
  }

  // Mask credentials in URI for logging
  const MONGODB_URI_FOR_LOGGING = MONGODB_URI.replace(/\/\/(.*:.*)@/, '//<credentials>@');
  console.log(`[db/connect.ts] Using MONGODB_URI (masked): ${MONGODB_URI_FOR_LOGGING}`);
  console.log(`[db/connect.ts] Using MONGODB_DB_NAME: ${MONGODB_DB_NAME}`);

  if (cachedClient && cachedDb) {
    try {
      // Ping the database to check if the connection is still alive
      await cachedClient.db(MONGODB_DB_NAME).command({ ping: 1 });
      console.log("[db/connect.ts] Using cached MongoDB connection.");
      return { client: cachedClient, db: cachedDb };
    } catch (e: any) {
      console.warn("[db/connect.ts] Cached MongoDB connection lost or ping failed. Attempting to reconnect...", e.message);
      cachedClient = null;
      cachedDb = null;
    }
  }

  let client: MongoClient;
  try {
    console.log("[db/connect.ts] Creating new MongoClient instance...");
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is selected
      connectTimeoutMS: 10000,       // Timeout for initial connection
      // Consider adding retryWrites=true&w=majority if not in URI and connecting to a replica set/Atlas
    });

    console.log("[db/connect.ts] Attempting to connect MongoClient...");
    await client.connect();
    console.log("[db/connect.ts] MongoClient connected successfully.");
    
    const db = client.db(MONGODB_DB_NAME);
    console.log(`[db/connect.ts] Successfully accessed database: ${MONGODB_DB_NAME}`);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error: any) {
    console.error("--------------------------------------------------------------------");
    console.error("[db/connect.ts] CRITICAL: FAILED TO CONNECT TO MONGODB.");
    console.error(`[db/connect.ts] URI used (credentials masked): ${MONGODB_URI_FOR_LOGGING}`);
    console.error(`[db/connect.ts] Database name target: ${MONGODB_DB_NAME}`);
    console.error(`[db/connect.ts] Error Type: ${error.name}`);
    console.error(`[db/connect.ts] Error Message: ${error.message}`);
    if (error.codeName) console.error(`[db/connect.ts] Error Code Name: ${error.codeName}`);
    if (error.code) console.error(`[db/connect.ts] Error Code: ${error.code}`);
    if (error.errorLabels) console.error(`[db/connect.ts] Error Labels: ${error.errorLabels.join(', ')}`);
    // if (error.topologyDescription) console.error(`[db/connect.ts] Topology Description: ${JSON.stringify(error.topologyDescription, null, 2)}`);
    console.error("--------------------------------------------------------------------");
    
    // Attempt to close client if it was instantiated
    if (client! && typeof client!.close === 'function') {
      try {
        await client!.close();
        console.log("[db/connect.ts] MongoDB client closed due to connection error.");
      } catch (closeError: any) {
        console.error("[db/connect.ts] Error closing MongoDB client after connection failure:", closeError.message);
      }
    }
    cachedClient = null; 
    cachedDb = null;
    return { client: null, db: null };
  }
}

// Export MongoDB utility types if needed elsewhere
export { type Collection, ObjectId } from 'mongodb';
export type { Db as MongoDbInstance } from 'mongodb'; // Exporting Db as MongoDbInstance
