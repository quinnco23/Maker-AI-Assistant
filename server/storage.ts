import { randomUUID } from "crypto";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "member" | "admin" | "staff";
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
    const mockUsers: User[] = [
      { id: "1", username: "janedoe", name: "Jane Doe", email: "jane@example.com", role: "member" },
      { id: "2", username: "profsmith", name: "Prof. Smith", email: "smith@university.edu", role: "admin" },
      { id: "3", username: "mikejohnson", name: "Mike Johnson", email: "mike@example.com", role: "member" },
      { id: "4", username: "sarahwilliams", name: "Sarah Williams", email: "sarah@example.com", role: "staff" },
    ];
    mockUsers.forEach(u => this.users.set(u.id, u));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

export const storage = new MemStorage();
