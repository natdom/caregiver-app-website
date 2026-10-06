import {
  WAITLIST_CONSENT_VERSION,
  WaitlistEntry,
  WaitlistFormData,
} from '@/lib/validations/waitlist'
import { ResendWaitlistStorage } from '@/lib/storage/resend-waitlist-storage'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export interface WaitlistStorage {
  create(data: WaitlistFormData): Promise<WaitlistEntry>
  findByEmail(email: string): Promise<WaitlistEntry | null>
  getAll(): Promise<WaitlistEntry[]>
  count(): Promise<number>
}

export class DuplicateWaitlistSignupError extends Error {
  constructor() {
    super('Email already registered')
    this.name = 'DuplicateWaitlistSignupError'
  }
}

export function redactEmailAddresses(value: string): string {
  return value.replace(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    '[redacted]'
  )
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
    if (!existsSync(this.filePath)) {
      return []
    }

    const content = await readFile(this.filePath, 'utf-8')
    let entries: unknown
    try {
      entries = JSON.parse(content)
    } catch {
      throw new Error('Waitlist data file contains invalid JSON')
    }

    if (!Array.isArray(entries)) {
      throw new Error('Waitlist data file must contain an array')
    }

    // Convert valid records back to the shared shape while preserving any
    // usable entries alongside a malformed array element.
    return entries.flatMap(entry => {
      if (typeof entry !== 'object' || entry === null) {
        return []
      }

      const stored = entry as Record<string, unknown>
      if (
        typeof stored.id !== 'string' ||
        stored.id.trim() === '' ||
        typeof stored.email !== 'string' ||
        stored.email.trim() === ''
      ) {
        return []
      }

      const submittedAt = new Date(String(stored.submittedAt))
      if (Number.isNaN(submittedAt.getTime())) {
        return []
      }

      const storedConsentAt =
        stored.consentAt === undefined
          ? submittedAt
          : new Date(String(stored.consentAt))
      const consentAt = Number.isNaN(storedConsentAt.getTime())
        ? submittedAt
        : storedConsentAt

      return [
        {
          id: stored.id,
          email: stored.email,
          name: typeof stored.name === 'string' ? stored.name : undefined,
          role: stored.role as WaitlistEntry['role'],
          consent: stored.consent === true,
          submittedAt,
          consentAt,
          consentVersion:
            typeof stored.consentVersion === 'string'
              ? stored.consentVersion
              : 'unknown',
        },
      ]
    })
  }

  private async writeEntries(entries: WaitlistEntry[]): Promise<void> {
    await this.ensureDataDir()
    await writeFile(this.filePath, JSON.stringify(entries, null, 2))
  }

  async create(data: WaitlistFormData): Promise<WaitlistEntry> {
    const entries = await this.readEntries()

    // Check for duplicate email
    const existing = entries.find(entry => entry.email === data.email)
    if (existing) {
      throw new DuplicateWaitlistSignupError()
    }

    const submittedAt = new Date()
    const entry: WaitlistEntry = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: data.role,
      consent: data.consent,
      submittedAt,
      consentAt: submittedAt,
      consentVersion: WAITLIST_CONSENT_VERSION,
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

// Factory function to get the appropriate storage adapter
export function createWaitlistStorage(): WaitlistStorage {
  if (process.env.RESEND_API_KEY) {
    return new ResendWaitlistStorage()
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('RESEND_API_KEY is required for waitlist storage in production')
  }

  return new FileWaitlistStorage()
}
