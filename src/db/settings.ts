import { ObjectId, type Collection } from 'mongodb';
import { connectToDatabase } from '../db/connect';
import { logAction } from '../db/logs';

export interface SystemSettingsDocument {
  _id?: ObjectId;
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMb: number;
  emailNotificationsEnabled: boolean;
  engineerApprovalRequired: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

export async function getSystemSettings(): Promise<SystemSettingsDocument | null> {
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('[db/settings.ts] getSystemSettings: Database connection not available.');
      return null;
    }
    const settingsCollection: Collection<SystemSettingsDocument> = db.collection('system_settings');
    let settings = await settingsCollection.findOne({});

    if (!settings) {
 console.warn('[db/settings.ts] System settings not found. Creating default settings using environment variables.');
        const defaultSettingsData: Omit<SystemSettingsDocument, '_id'> = {
 siteName: process.env.SITE_NAME || "المحترف لحساب الكميات", // Default site name from env or fallback
 defaultLanguage: process.env.DEFAULT_LANGUAGE || "ar", // Default language from env or fallback
            maintenanceMode: false,
 maxUploadSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '25', 10), // Default max upload size in MB from env or fallback
            emailNotificationsEnabled: true,
 engineerApprovalRequired: true, // This default is hardcoded as per current logic
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await settingsCollection.insertOne(defaultSettingsData);
        settings = await settingsCollection.findOne({ _id: result.insertedId });
        await logAction('SYSTEM_SETTINGS_CREATED_DEFAULT', 'INFO', 'Default system settings created as none were found.');
    }
 return settings;
  } catch (error) {
    console.error('[db/settings.ts] Error fetching/creating system settings:', error);
 return null;
  }
}
