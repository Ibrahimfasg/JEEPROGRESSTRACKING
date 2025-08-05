import { firebaseStorage } from './firebase-storage';
import { initializeFirebaseUsers } from './firebase-init';

// Initialize Firebase users when the module loads
let initialized = false;

export async function ensureFirebaseInitialized() {
  if (!initialized) {
    await initializeFirebaseUsers();
    initialized = true;
  }
}

// API functions that use Firebase directly
export const firebaseApi = {
  // Auth
  async login(username: string, password: string) {
    await ensureFirebaseInitialized();
    const user = await firebaseStorage.getUserByUsername(username);
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    return {
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        displayName: user.displayName
      }
    };
  },

  // Users
  async getAllUsers() {
    await ensureFirebaseInitialized();
    const users = await firebaseStorage.getAllUsers();
    return users.map(user => ({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      displayName: user.displayName
    }));
  },

  // Progress
  async getProgress(userId: string) {
    return await firebaseStorage.getAllProgressData(userId);
  },

  async updateProgress(data: { userId: string; subject: string; topicProgress: Record<string, boolean> }) {
    return await firebaseStorage.upsertProgressData(data);
  },

  // Daily Study
  async getDailyStudy(userId: string, date: string) {
    const result = await firebaseStorage.getDailyStudy(userId, date);
    return result || { studyPlan: '' };
  },

  async updateDailyStudy(data: { userId: string; studyPlan: string; date: string }) {
    return await firebaseStorage.upsertDailyStudy(data);
  }
};