
// src/db/connect.ts
import { MongoClient, type Db as MongoDb } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let cachedClient: MongoClient | null = null;
let cachedDb: MongoDb | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: MongoDb | null }> {
  if (!MONGODB_URI) {
    console.error("[db/connect.ts] CRITICAL: MONGODB_URI is not defined in environment variables. Connection cannot proceed.");
    return { client: null, db: null };
  }
  if (!MONGODB_DB_NAME) {
    console.error("[db/connect.ts] CRITICAL: MONGODB_DB_NAME is not defined in environment variables. Connection cannot proceed.");
    return { client: null, db: null };
  }

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
    // Mask parts of the URI for logging if it contains credentials
    const MONGODB_URI_FOR_LOGGING = MONGODB_URI.replace(/\/\/(.*:.*)@/, '//<credentials>@');
    console.log(`[db/connect.ts] Attempting to create MongoClient with URI (credentials masked): ${MONGODB_URI_FOR_LOGGING}`);
    
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is selected
      connectTimeoutMS: 10000, // Timeout for initial connection
    });

    console.log("[db/connect.ts] MongoClient instance created. Attempting to connect...");
    await client.connect();
    console.log("[db/connect.ts] Successfully connected MongoClient.");
    
    const db = client.db(MONGODB_DB_NAME);
    console.log("[db/connect.ts] Successfully accessed database:", MONGODB_DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error: any) {
    console.error("--------------------------------------------------------------------");
    console.error("[db/connect.ts] CRITICAL: FAILED TO CONNECT TO MONGODB.");
    console.error(`[db/connect.ts] URI used (credentials masked): ${MONGODB_URI.replace(/\/\/(.*:.*)@/, '//<credentials>@')}`);
    console.error(`[db/connect.ts] Database name target: ${MONGODB_DB_NAME}`);
    console.error(`[db/connect.ts] Error Type: ${error.name}`);
    console.error(`[db/connect.ts] Error Message: ${error.message}`);
    if (error.code) console.error(`[db/connect.ts] Error Code: ${error.code}`);
    if (error.errorLabels) console.error(`[db/connect.ts] Error Labels: ${error.errorLabels.join(', ')}`);
    if (error.topologyVersion) console.error(`[db/connect.ts] Topology Version: ${JSON.stringify(error.topologyVersion)}`);
    console.error("--------------------------------------------------------------------");

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

// Export MongoDB utility types if needed elsewhere, though direct use is less common with an abstraction layer.
export { type Db as MongoDbInstance, type Collection, ObjectId } from 'mongodb';
