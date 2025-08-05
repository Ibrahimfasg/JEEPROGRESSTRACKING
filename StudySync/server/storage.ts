import { type User, type InsertUser, type ProgressData, type InsertProgressData, type DailyStudy, type InsertDailyStudy } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Progress operations
  getProgressData(userId: string, subject: string): Promise<ProgressData | undefined>;
  getAllProgressData(userId: string): Promise<ProgressData[]>;
  upsertProgressData(data: InsertProgressData): Promise<ProgressData>;
  
  // Daily study operations
  getDailyStudy(userId: string, date: string): Promise<DailyStudy | undefined>;
  upsertDailyStudy(data: InsertDailyStudy): Promise<DailyStudy>;
  getAllUsers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private progressData: Map<string, ProgressData>;
  private dailyStudy: Map<string, DailyStudy>;

  constructor() {
    this.users = new Map();
    this.progressData = new Map();
    this.dailyStudy = new Map();
    
    // Initialize default users
    this.initializeDefaultUsers();
  }

  private async initializeDefaultUsers() {
    const himUser: User = {
      id: randomUUID(),
      username: "him",
      password: "80085",
      avatar: "boy",
      displayName: "Him"
    };
    
    const herUser: User = {
      id: randomUUID(),
      username: "her",
      password: "1234",
      avatar: "girl",
      displayName: "Her"
    };
    
    this.users.set(himUser.id, himUser);
    this.users.set(herUser.id, herUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProgressData(userId: string, subject: string): Promise<ProgressData | undefined> {
    return Array.from(this.progressData.values()).find(
      (data) => data.userId === userId && data.subject === subject
    );
  }

  async getAllProgressData(userId: string): Promise<ProgressData[]> {
    return Array.from(this.progressData.values()).filter(
      (data) => data.userId === userId
    );
  }

  async upsertProgressData(data: InsertProgressData): Promise<ProgressData> {
    const existing = await this.getProgressData(data.userId, data.subject);
    
    if (existing) {
      const updated: ProgressData = {
        ...existing,
        topicProgress: data.topicProgress || {},
        updatedAt: new Date(),
      };
      this.progressData.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newData: ProgressData = {
        id,
        userId: data.userId,
        subject: data.subject,
        topicProgress: data.topicProgress || {},
        updatedAt: new Date(),
      };
      this.progressData.set(id, newData);
      return newData;
    }
  }

  async getDailyStudy(userId: string, date: string): Promise<DailyStudy | undefined> {
    return Array.from(this.dailyStudy.values()).find(
      (study) => study.userId === userId && study.date === date
    );
  }

  async upsertDailyStudy(data: InsertDailyStudy): Promise<DailyStudy> {
    const existing = await this.getDailyStudy(data.userId, data.date);
    
    if (existing) {
      const updated: DailyStudy = {
        ...existing,
        studyPlan: data.studyPlan,
      };
      this.dailyStudy.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newStudy: DailyStudy = {
        id,
        userId: data.userId,
        studyPlan: data.studyPlan,
        date: data.date,
        createdAt: new Date(),
      };
      this.dailyStudy.set(id, newStudy);
      return newStudy;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

export const storage = new MemStorage();
