// Storage interface for Time Table Generator
// Note: This application uses localStorage on the client-side for persistence
// The server primarily serves the frontend application

export interface IStorage {
  // Add any server-side storage methods here if needed in the future
}

export class MemStorage implements IStorage {
  // Memory storage implementation
  // Currently unused as the app uses client-side localStorage
}

export const storage = new MemStorage();
