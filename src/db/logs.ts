import { ObjectId, type Collection } from 'mongodb';
import { connectToDatabase } from '../db/connect';

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntryDocument {
  _id?: ObjectId;
  action: string;
  level: LogLevel;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  userId?: ObjectId | string;
}


// تسجيل الإجراءات في قاعدة البيانات
export async function logAction(
  action: string,
  level: LogLevel,
  message: string,
  userId?: ObjectId | string | null,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('[db/logs.ts] logAction: Database connection not available. Could not log:', {action, level, message, userId});
      return;
    }

    // Ensure index is created for efficient sorting
    await logsCollection.createIndex({ createdAt: -1 });

    const logsCollection: Collection<LogEntryDocument> = db.collection('logs');
    const logEntry: LogEntryDocument = {
      action,
      level,
      message,
      createdAt: new Date(),
    };
    await logsCollection.insertOne(logEntry);
  } catch (error) {
    console.error('[db/logs.ts] Failed to log action:', error);
  }
}
