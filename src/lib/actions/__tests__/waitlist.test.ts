const { countMock, createMock, redirectMock } = vi.hoisted(() => ({
  countMock: vi.fn(),
  createMock: vi.fn(),
  redirectMock: vi.fn(),
}))

vi.mock('@/lib/storage/waitlist-adapter', async importOriginal => {
  const actual = await importOriginal<
    typeof import('@/lib/storage/waitlist-adapter')
  >()
  return {
    ...actual,
    createWaitlistStorage: () => ({ count: countMock, create: createMock }),
  }
})

vi.mock('next/navigation', () => ({ redirect: redirectMock }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import {
  getWaitlistCount,
  submitWaitlistForm,
} from '@/lib/actions/waitlist'
import { DuplicateWaitlistSignupError } from '@/lib/storage/waitlist-adapter'

function validFormData(): FormData {
  const formData = new FormData()
  formData.set('name', 'Avery')
  formData.set('email', 'caregiver@example.com')
  formData.set('role', 'caregiver')
  formData.set('consent', 'on')
  return formData
}

describe('submitWaitlistForm storage failures', () => {
  beforeEach(() => {
    createMock.mockReset()
    countMock.mockReset()
    redirectMock.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns failure and does not redirect when storage rejects', async () => {
    createMock.mockRejectedValueOnce(new Error('Provider unavailable'))

    const result = await submitWaitlistForm(null, validFormData())

    expect(result).toEqual({
      success: false,
      message:
        'We could not save your signup. Please email hello@joinpero.com directly.',
    })
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('preserves the duplicate-email response', async () => {
    createMock.mockRejectedValueOnce(new DuplicateWaitlistSignupError())

    await expect(
      submitWaitlistForm(null, validFormData())
    ).resolves.toMatchObject({
      success: false,
      message: "You're already on our waitlist! Check your email for updates.",
      errors: { email: ['This email is already registered'] },
    })
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('turns a provider create conflict into the duplicate response', async () => {
    createMock.mockRejectedValueOnce(new DuplicateWaitlistSignupError())

    await expect(
      submitWaitlistForm(null, validFormData())
    ).resolves.toMatchObject({
      success: false,
      message: "You're already on our waitlist! Check your email for updates.",
      errors: { email: ['This email is already registered'] },
    })
  })

  it('redacts provider email addresses before logging storage errors', async () => {
    createMock.mockRejectedValueOnce(
      new Error('Provider rejected caregiver@example.com')
    )

    await submitWaitlistForm(null, validFormData())

    const logged = JSON.stringify(vi.mocked(console.error).mock.calls)
    expect(logged).toContain('[redacted]')
    expect(logged).not.toContain('caregiver')
    expect(logged).not.toContain('example.com')
  })

  it('logs only redacted error details when counting fails', async () => {
    countMock.mockRejectedValueOnce(
      new Error('Provider rejected caregiver@example.com')
    )

    await expect(getWaitlistCount()).resolves.toBe(0)

    expect(console.error).toHaveBeenCalledWith(
      'Error getting waitlist count:',
      {
        name: 'Error',
        message: 'Provider rejected [redacted]',
      }
    )
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls)
    expect(logged).not.toContain('caregiver')
    expect(logged).not.toContain('example.com')
  })

  it('does not pass IP address or user agent to storage', async () => {
    createMock.mockRejectedValueOnce(new Error('Stop after capture'))

    await submitWaitlistForm(null, validFormData())

    expect(createMock).toHaveBeenCalledWith({
      name: 'Avery',
      email: 'caregiver@example.com',
      role: 'caregiver',
      consent: true,
    })
    expect(createMock.mock.calls[0][0]).not.toHaveProperty('ipAddress')
    expect(createMock.mock.calls[0][0]).not.toHaveProperty('userAgent')
  })
})
