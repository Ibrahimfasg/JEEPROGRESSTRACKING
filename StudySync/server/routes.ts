import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgressDataSchema, insertDailyStudySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          avatar: user.avatar, 
          displayName: user.displayName 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all users (for partner view)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        displayName: user.displayName
      }));
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Progress routes
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const progressData = await storage.getAllProgressData(userId);
      res.json(progressData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress data" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertProgressDataSchema.parse(req.body);
      const progressData = await storage.upsertProgressData(validatedData);
      res.json(progressData);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // Daily study routes
  app.get("/api/daily-study/:userId/:date", async (req, res) => {
    try {
      const { userId, date } = req.params;
      const dailyStudy = await storage.getDailyStudy(userId, date);
      res.json(dailyStudy || { studyPlan: "" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily study" });
    }
  });

  app.post("/api/daily-study", async (req, res) => {
    try {
      const validatedData = insertDailyStudySchema.parse(req.body);
      const dailyStudy = await storage.upsertDailyStudy(validatedData);
      res.json(dailyStudy);
    } catch (error) {
      res.status(400).json({ message: "Invalid daily study data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
