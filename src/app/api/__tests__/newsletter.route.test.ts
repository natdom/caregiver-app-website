import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from '../newsletter/route'
import {
  isEmailConfigured,
  sendNewsletterNotification,
} from '@/lib/email/resend'

vi.mock('@/lib/email/resend', () => ({
  isEmailConfigured: vi.fn(),
  sendNewsletterNotification: vi.fn(),
}))

const configuredMock = vi.mocked(isEmailConfigured)
const sendMock = vi.mocked(sendNewsletterNotification)

function request(payload: unknown) {
  return new NextRequest('http://localhost/api/newsletter', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'content-type': 'application/json' },
  })
}

const validPayload = {
  email: 'newsletter-private@private-company.example',
  name: 'Private Subscriber',
  role: 'caregiver',
  source: 'footer',
  assessmentStage: 'planning',
}

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    configuredMock.mockReturnValue(true)
    sendMock.mockResolvedValue({})
  })

  it('returns 200 only after delivering the notification with the signup address', async () => {
    const response = await POST(request(validPayload))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      message: "Thank you for joining! We'll keep you updated on our progress.",
    })
    expect(sendMock).toHaveBeenCalledWith(validPayload)
  })

  it('returns 502 when delivery fails', async () => {
    sendMock.mockRejectedValue(new Error('provider unavailable'))

    const response = await POST(request(validPayload))

    expect(response.status).toBe(502)
    expect(response.status).not.toBe(200)
  })

  it('returns 200 when the notification is delivered but the contact write fails', async () => {
    sendMock.mockResolvedValue({
      contactError: { name: 'ResendContactError', message: 'Provider unavailable' },
    })
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const response = await POST(request(validPayload))

    expect(response.status).toBe(200)
    expect(errorSpy).toHaveBeenCalledWith(
      'Newsletter contact write failed:',
      expect.objectContaining({ name: 'ResendContactError' })
    )
    errorSpy.mockRestore()
  })

  it('redacts subscriber addresses from contact-write error logs', async () => {
    sendMock.mockResolvedValue({
      contactError: {
        name: 'ResendContactError',
        message: `Provider rejected ${validPayload.email}`,
      },
    })
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const response = await POST(request(validPayload))

    expect(response.status).toBe(200)
    const logged = JSON.stringify(errorSpy.mock.calls)
    expect(logged).toContain('[redacted]')
    expect(logged).not.toContain(validPayload.email)
    errorSpy.mockRestore()
  })

  it('returns 503 without attempting delivery when email is not configured', async () => {
    configuredMock.mockReturnValue(false)

    const response = await POST(request(validPayload))

    expect(response.status).toBe(503)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns 400 without attempting delivery for invalid input', async () => {
    const response = await POST(request({ ...validPayload, email: 'invalid' }))

    expect(response.status).toBe(400)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('does not log raw PII on success', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    await POST(request(validPayload))

    const logged = JSON.stringify(logSpy.mock.calls)
    expect(logged).not.toContain(validPayload.email)
    logSpy.mockRestore()
  })
})
