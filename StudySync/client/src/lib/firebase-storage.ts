import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import type { User, ProgressData, DailyStudy, InsertUser, InsertProgressData, InsertDailyStudy } from '@shared/schema';
import type { IStorage } from '../../../server/storage';

export class FirebaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as User : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return undefined;
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const docRef = await addDoc(collection(db, 'users'), userData);
      const user: User = { id: docRef.id, ...userData };
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Progress operations
  async getProgressData(userId: string, subject: string): Promise<ProgressData | undefined> {
    try {
      const q = query(
        collection(db, 'progress'), 
        where('userId', '==', userId), 
        where('subject', '==', subject)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return undefined;
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data(), updatedAt: doc.data().updatedAt?.toDate() } as ProgressData;
    } catch (error) {
      console.error('Error getting progress data:', error);
      return undefined;
    }
  }

  async getAllProgressData(userId: string): Promise<ProgressData[]> {
    try {
      const q = query(collection(db, 'progress'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as ProgressData));
    } catch (error) {
      console.error('Error getting all progress data:', error);
      return [];
    }
  }

  async upsertProgressData(data: InsertProgressData): Promise<ProgressData> {
    try {
      const existing = await this.getProgressData(data.userId, data.subject);
      
      if (existing) {
        const updateData = {
          topicProgress: data.topicProgress || {},
          updatedAt: serverTimestamp()
        };
        await updateDoc(doc(db, 'progress', existing.id), updateData);
        return { ...existing, topicProgress: data.topicProgress || {}, updatedAt: new Date() };
      } else {
        const newData = {
          userId: data.userId,
          subject: data.subject,
          topicProgress: data.topicProgress || {},
          updatedAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'progress'), newData);
        return {
          id: docRef.id,
          userId: data.userId,
          subject: data.subject,
          topicProgress: data.topicProgress || {},
          updatedAt: new Date()
        };
      }
    } catch (error) {
      console.error('Error upserting progress data:', error);
      throw error;
    }
  }

  // Daily study operations
  async getDailyStudy(userId: string, date: string): Promise<DailyStudy | undefined> {
    try {
      const q = query(
        collection(db, 'dailyStudy'), 
        where('userId', '==', userId), 
        where('date', '==', date)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return undefined;
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() } as DailyStudy;
    } catch (error) {
      console.error('Error getting daily study:', error);
      return undefined;
    }
  }

  async upsertDailyStudy(data: InsertDailyStudy): Promise<DailyStudy> {
    try {
      const existing = await this.getDailyStudy(data.userId, data.date);
      
      if (existing) {
        const updateData = { studyPlan: data.studyPlan };
        await updateDoc(doc(db, 'dailyStudy', existing.id), updateData);
        return { ...existing, studyPlan: data.studyPlan };
      } else {
        const newData = {
          userId: data.userId,
          studyPlan: data.studyPlan,
          date: data.date,
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'dailyStudy'), newData);
        return {
          id: docRef.id,
          userId: data.userId,
          studyPlan: data.studyPlan,
          date: data.date,
          createdAt: new Date()
        };
      }
    } catch (error) {
      console.error('Error upserting daily study:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
}

export const firebaseStorage = new FirebaseStorage();