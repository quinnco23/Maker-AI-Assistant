import { z } from "zod";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "member" | "admin" | "staff";
  certifications: string[];
  lastActive: string;
  avatar?: string;
}

export interface Makerspace {
  id: string;
  name: string;
  setupComplete: boolean;
  supportedTools: string[];
  retentionPolicy: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  icon: string;
  models: MachineModel[];
}

export interface MachineModel {
  id: string;
  toolId: string;
  name: string;
  manufacturer: string;
  sopReady: boolean;
  specs: Record<string, string>;
}

export interface KBDocument {
  id: string;
  title: string;
  toolId: string;
  modelId?: string;
  topic: string;
  tags: string[];
  published: boolean;
  type: "manual" | "sop" | "safety" | "troubleshooting" | "spec";
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  toolId: string;
  modelId: string;
  intent: "plan" | "run" | "troubleshoot";
  status: "active" | "completed" | "escalated";
  riskLevel: "low" | "medium" | "high";
  triggerReason?: string;
  createdAt: string;
  summary?: string;
}

export interface Escalation {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  toolName: string;
  modelName: string;
  status: "new" | "acknowledged" | "resolved";
  summary: string;
  stepsAttempted: string[];
  triggerReason: string;
  resolutionNotes?: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  name: string;
  toolId: string;
  modelId?: string;
  mandatory: boolean;
  items: ChecklistItem[];
}

export interface ChecklistRun {
  id: string;
  checklistId: string;
  checklistName: string;
  userId: string;
  toolName: string;
  completedAt: string;
  passed: boolean;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  tool: string;
  goal: string;
  status: "idea" | "in_progress" | "complete";
  notes: string;
  linkedSessions: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface SafetyRule {
  id: string;
  category: string;
  rule: string;
  severity: "warning" | "critical";
}

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  tool: z.string().min(1, "Tool is required"),
  goal: z.string().min(1, "Goal is required"),
});

export type CreateProject = z.infer<typeof createProjectSchema>;
