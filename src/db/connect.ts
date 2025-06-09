
// src/db/connect.ts
import { MongoClient, type Db as MongoDbInstance } from 'mongodb';
import dotenv from 'dotenv';

// Explicitly load environment variables from .env file at the very beginning
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let cachedClient: MongoClient | null = null;
let cachedDb: MongoDbInstance | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: MongoDbInstance | null }> {
  if (!MONGODB_URI) {
    console.error("--------------------------------------------------------------------");
    console.error("[db/connect.ts] CRITICAL: MONGODB_URI is not defined.");
    console.error("Ensure MONGODB_URI is set in your .env file.");
    console.error("Example: MONGODB_URI=\"mongodb://localhost:27017/your_db_name\"");
    console.error("Or for Atlas: MONGODB_URI=\"mongodb+srv://user:pass@cluster.mongodb.net/your_db_name?retryWrites=true&w=majority\"");
    console.error("--------------------------------------------------------------------");
    return { client: null, db: null };
  }
  if (!MONGODB_DB_NAME) {
    console.error("--------------------------------------------------------------------");
    console.error("[db/connect.ts] CRITICAL: MONGODB_DB_NAME is not defined.");
    console.error("Ensure MONGODB_DB_NAME is set in your .env file.");
    console.error("Example: MONGODB_DB_NAME=\"your_actual_database_name\"");
    console.error("--------------------------------------------------------------------");
    return { client: null, db: null };
  }

  // Mask credentials in URI for logging
  const MONGODB_URI_FOR_LOGGING = MONGODB_URI.replace(/\/\/(.*:.*)@/, '//<credentials>@');
  console.log(`[db/connect.ts] Attempting connection with MONGODB_URI (masked): ${MONGODB_URI_FOR_LOGGING}`);
  console.log(`[db/connect.ts] Target database name (MONGODB_DB_NAME): ${MONGODB_DB_NAME}`);

  if (cachedClient && cachedDb) {
    try {
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
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
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
    console.error("--------------------------------------------------------------------");
    
    if (cachedClient && typeof cachedClient.close === 'function') {
      try {
        await cachedClient.close();
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

export { type Collection, ObjectId, type MongoDbInstance } from 'mongodb';
