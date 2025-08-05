import { firebaseStorage } from './firebase-storage';
import type { InsertUser } from '@shared/schema';

// Initialize default users in Firebase
export async function initializeFirebaseUsers() {
  try {
    // Check if users already exist
    const existingHim = await firebaseStorage.getUserByUsername('him');
    const existingHer = await firebaseStorage.getUserByUsername('her');

    if (!existingHim) {
      const himUser: InsertUser = {
        username: 'him',
        password: '80085',
        avatar: 'boy',
        displayName: 'Him'
      };
      await firebaseStorage.createUser(himUser);
      console.log('Created default user: Him');
    }

    if (!existingHer) {
      const herUser: InsertUser = {
        username: 'her',
        password: '1234',
        avatar: 'girl',
        displayName: 'Her'
      };
      await firebaseStorage.createUser(herUser);
      console.log('Created default user: Her');
    }

    console.log('Firebase users initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase users:', error);
  }
}