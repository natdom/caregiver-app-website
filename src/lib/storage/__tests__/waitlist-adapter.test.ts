import {
  createWaitlistStorage,
  DuplicateWaitlistSignupError,
  FileWaitlistStorage,
  redactEmailAddresses,
} from '@/lib/storage/waitlist-adapter'
import { ResendWaitlistStorage } from '@/lib/storage/resend-waitlist-storage'
import { WAITLIST_CONSENT_VERSION } from '@/lib/validations/waitlist'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'fs/promises'
import os from 'os'
import path from 'path'

const signup = {
  email: 'caregiver@example.com',
  name: 'Avery',
  role: 'caregiver' as const,
  consent: true,
}

describe('redactEmailAddresses', () => {
  it('redacts literal and percent-encoded email addresses identically', () => {
    expect(
      redactEmailAddresses(
        'literal caregiver@example.com encoded caregiver%40example.com'
      )
    ).toBe('literal [redacted] encoded [redacted]')
  })
})

async function fileStorageFixture(): Promise<{
  storage: FileWaitlistStorage
  directory: string
  filePath: string
}> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'pero-waitlist-'))
  const dataDir = path.join(directory, 'data')
  const filePath = path.join(dataDir, 'waitlist.json')
  const storage = new FileWaitlistStorage()
  Object.assign(storage, { dataDir, filePath })
  return { storage, directory, filePath }
}

describe('createWaitlistStorage', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses Resend whenever RESEND_API_KEY is configured', () => {
    vi.stubEnv('RESEND_API_KEY', 're_test_key')
    vi.stubEnv('NODE_ENV', 'production')

    expect(createWaitlistStorage()).toBeInstanceOf(ResendWaitlistStorage)
  })

  it('uses file storage without a key outside production', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(createWaitlistStorage()).toBeInstanceOf(FileWaitlistStorage)
  })

  it('throws without a key in production', () => {
    vi.stubEnv('NODE_ENV', 'production')

    expect(() => createWaitlistStorage()).toThrow('RESEND_API_KEY')
  })
})

describe('FileWaitlistStorage', () => {
  const directories: string[] = []

  afterEach(async () => {
    await Promise.all(
      directories.splice(0).map(directory =>
        rm(directory, { recursive: true, force: true })
      )
    )
  })

  async function setup(): Promise<
    Awaited<ReturnType<typeof fileStorageFixture>>
  > {
    const fixture = await fileStorageFixture()
    directories.push(fixture.directory)
    return fixture
  }

  it('round-trips consent metadata', async () => {
    const { storage } = await setup()

    const created = await storage.create(signup)
    const stored = await storage.findByEmail(signup.email)

    expect(created.consentVersion).toBe(WAITLIST_CONSENT_VERSION)
    expect(created.consentAt).toBeInstanceOf(Date)
    expect(stored).toEqual(created)
  })

  it('uses legacy consent metadata fallbacks', async () => {
    const { storage, filePath } = await setup()
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(
      filePath,
      JSON.stringify([
        {
          id: 'legacy-1',
          email: signup.email,
          role: signup.role,
          consent: true,
          submittedAt: '2026-10-05T12:00:00.000Z',
        },
      ])
    )

    await expect(storage.getAll()).resolves.toMatchObject([
      {
        consentAt: new Date('2026-10-05T12:00:00.000Z'),
        consentVersion: 'unknown',
      },
    ])
  })

  it('keeps valid records when another array element is malformed', async () => {
    const { storage, filePath } = await setup()
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(
      filePath,
      JSON.stringify([
        {
          id: 'valid-1',
          email: 'first@example.com',
          role: 'partner',
          consent: true,
          submittedAt: '2026-10-05T12:00:00.000Z',
        },
        null,
        { id: 'missing-email', submittedAt: '2026-10-05T12:00:00.000Z' },
      ])
    )

    await storage.create(signup)

    const persisted = JSON.parse(await readFile(filePath, 'utf-8')) as Array<{
      id: string
    }>
    expect(persisted.map(entry => entry.id)).toEqual([
      'valid-1',
      expect.any(String),
    ])
  })

  it('does not overwrite a present file containing invalid JSON', async () => {
    const { storage, filePath } = await setup()
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(filePath, '{not-json')

    await expect(storage.create(signup)).rejects.toThrow('invalid JSON')
    await expect(readFile(filePath, 'utf-8')).resolves.toBe('{not-json')
  })

  it('does not overwrite a present file whose top level is not an array', async () => {
    const { storage, filePath } = await setup()
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(filePath, JSON.stringify({ entries: [] }))

    await expect(storage.create(signup)).rejects.toThrow('must contain an array')
    await expect(readFile(filePath, 'utf-8')).resolves.toBe('{"entries":[]}')
  })

  it('throws the shared duplicate error type', async () => {
    const { storage } = await setup()
    await storage.create(signup)

    await expect(storage.create(signup)).rejects.toBeInstanceOf(
      DuplicateWaitlistSignupError
    )
  })
})
