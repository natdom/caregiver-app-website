import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from '../contact/route'
import { isEmailConfigured, sendContactNotification } from '@/lib/email/resend'

vi.mock('@/lib/email/resend', () => ({
  isEmailConfigured: vi.fn(),
  sendContactNotification: vi.fn(),
}))

const configuredMock = vi.mocked(isEmailConfigured)
const sendMock = vi.mocked(sendContactNotification)

function request(payload: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'content-type': 'application/json' },
  })
}

const validPayload = {
  name: 'Private Person',
  email: 'contact-private@private-company.example',
  role: 'family-caregiver',
  message: 'DISTINCTIVE_PRIVATE_CONTACT_MESSAGE_48291',
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    configuredMock.mockReturnValue(true)
    sendMock.mockResolvedValue(undefined)
  })

  it('returns 200 only after delivering the notification with the reply-to address', async () => {
    const response = await POST(request(validPayload))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      message: "Thank you for your message. We'll be in touch soon!",
    })
    expect(sendMock).toHaveBeenCalledWith(validPayload)
  })

  it('returns 502 when delivery fails', async () => {
    sendMock.mockRejectedValue(new Error('provider unavailable'))

    const response = await POST(request(validPayload))

    expect(response.status).toBe(502)
    expect(response.status).not.toBe(200)
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
    expect(logged).not.toContain(validPayload.message)
    logSpy.mockRestore()
  })
})
