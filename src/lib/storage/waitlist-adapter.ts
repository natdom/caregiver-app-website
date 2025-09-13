import { WaitlistEntry, WaitlistFormData } from '@/lib/validations/waitlist'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export interface WaitlistStorage {
  create(data: WaitlistFormData & { ipAddress?: string; userAgent?: string }): Promise<WaitlistEntry>
  findByEmail(email: string): Promise<WaitlistEntry | null>
  getAll(): Promise<WaitlistEntry[]>
  count(): Promise<number>
}

// File-based storage for development
export class FileWaitlistStorage implements WaitlistStorage {
  private dataDir = path.join(process.cwd(), 'data')
  private filePath = path.join(this.dataDir, 'waitlist.json')

  private async ensureDataDir(): Promise<void> {
    if (!existsSync(this.dataDir)) {
      await mkdir(this.dataDir, { recursive: true })
    }
  }

  private async readEntries(): Promise<WaitlistEntry[]> {
    try {
      if (!existsSync(this.filePath)) {
        return []
      }
      const content = await readFile(this.filePath, 'utf-8')
      const entries = JSON.parse(content)
      // Convert date strings back to Date objects
      return entries.map((entry: any) => ({
        ...entry,
        submittedAt: new Date(entry.submittedAt)
      }))
    } catch {
      return []
    }
  }

  private async writeEntries(entries: WaitlistEntry[]): Promise<void> {
    await this.ensureDataDir()
    await writeFile(this.filePath, JSON.stringify(entries, null, 2))
  }

  async create(data: WaitlistFormData & { ipAddress?: string; userAgent?: string }): Promise<WaitlistEntry> {
    const entries = await this.readEntries()
    
    // Check for duplicate email
    const existing = entries.find(entry => entry.email === data.email)
    if (existing) {
      throw new Error('Email already registered')
    }

    const entry: WaitlistEntry = {
      ...data,
      id: crypto.randomUUID(),
      submittedAt: new Date()
    }

    entries.push(entry)
    await this.writeEntries(entries)
    return entry
  }

  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    const entries = await this.readEntries()
    return entries.find(entry => entry.email === email) || null
  }

  async getAll(): Promise<WaitlistEntry[]> {
    return this.readEntries()
  }

  async count(): Promise<number> {
    const entries = await this.readEntries()
    return entries.length
  }
}

// Future: PostgreSQL storage adapter
export class PostgresWaitlistStorage implements WaitlistStorage {
  constructor(private connectionString: string) {}

  async create(data: WaitlistFormData & { ipAddress?: string; userAgent?: string }): Promise<WaitlistEntry> {
    // TODO: Implement PostgreSQL storage
    throw new Error('PostgreSQL storage not yet implemented')
  }

  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    // TODO: Implement PostgreSQL storage
    throw new Error('PostgreSQL storage not yet implemented')
  }

  async getAll(): Promise<WaitlistEntry[]> {
    // TODO: Implement PostgreSQL storage  
    throw new Error('PostgreSQL storage not yet implemented')
  }

  async count(): Promise<number> {
    // TODO: Implement PostgreSQL storage
    throw new Error('PostgreSQL storage not yet implemented')
  }
}

// Factory function to get the appropriate storage adapter
export function createWaitlistStorage(): WaitlistStorage {
  // For now, always use file storage in development
  // Later: check environment variable for database URL
  const dbUrl = process.env.DATABASE_URL
  
  if (dbUrl && process.env.NODE_ENV === 'production') {
    return new PostgresWaitlistStorage(dbUrl)
  }
  
  return new FileWaitlistStorage()
}