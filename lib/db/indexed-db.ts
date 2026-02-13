import Dexie, { Table } from 'dexie';
import type { MessageSchema, FileAttachment, FamilySchema, MemberSchema } from './schema';

export class FamilyMessengerDB extends Dexie {
  messages!: Table<MessageSchema, string>;
  files!: Table<FileAttachment, string>;
  family!: Table<FamilySchema, string>;
  members!: Table<MemberSchema, string>;

  constructor() {
    super('FamilyMessengerDB');

    this.version(1).stores({
      messages: 'id, timestamp, senderId',
      files: 'id, messageId',
      family: 'id',
      members: 'id, name'
    });
  }
}

export const db = new FamilyMessengerDB();

// Helper functions
export const dbHelpers = {
  // Messages
  async addMessage(message: MessageSchema): Promise<void> {
    await db.messages.add(message);
  },

  async getMessages(limit: number = 100, before?: number): Promise<MessageSchema[]> {
    let query = db.messages.orderBy('timestamp').reverse();
    if (before) {
      query = query.filter(m => m.timestamp < before);
    }
    return query.limit(limit).toArray();
  },

  async updateMessageStatus(id: string, status: MessageSchema['status']): Promise<void> {
    await db.messages.update(id, { status });
  },

  async clearMessages(): Promise<void> {
    await db.messages.clear();
  },

  // Files
  async addFile(file: FileAttachment): Promise<void> {
    await db.files.add(file);
  },

  async getFile(id: string): Promise<FileAttachment | undefined> {
    return db.files.get(id);
  },

  // Family
  async saveFamily(family: FamilySchema): Promise<void> {
    await db.family.put(family);
  },

  async getFamily(): Promise<FamilySchema | undefined> {
    return db.family.toCollection().first();
  },

  async clearFamily(): Promise<void> {
    await db.family.clear();
  },

  // Members
  async addMember(member: MemberSchema): Promise<void> {
    await db.members.put(member);
  },

  async getMember(id: string): Promise<MemberSchema | undefined> {
    return db.members.get(id);
  },

  async updateMember(id: string, updates: Partial<MemberSchema>): Promise<void> {
    await db.members.update(id, updates);
  },

  async getAllMembers(): Promise<MemberSchema[]> {
    return db.members.toArray();
  },

  async clearMembers(): Promise<void> {
    await db.members.clear();
  }
};
