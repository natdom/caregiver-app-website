import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'withCare'
  const subtitle = searchParams.get('subtitle') || 'A supportive space for caregivers of all kinds'

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 
                'radial-gradient(circle at 25px 25px, rgba(14, 165, 233, 0.3) 2px, transparent 0), ' +
                'radial-gradient(circle at 75px 75px, rgba(5, 150, 105, 0.3) 2px, transparent 0)',
              backgroundSize: '100px 100px',
            }}
          />

          {/* Logo/Brand mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20,
              }}
            >
              {/* Heart icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'white' }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: 'white',
              }}
            >
              withCare
            </div>
          </div>

          {/* Main title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: 900,
              padding: '0 60px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? 48 : 64,
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.1,
                margin: 0,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              {title}
            </h1>
            
            {subtitle && (
              <p
                style={{
                  fontSize: 24,
                  color: '#94a3b8',
                  margin: 0,
                  lineHeight: 1.4,
                  textAlign: 'center',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Bottom accent */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 8,
              background: 'linear-gradient(90deg, #0ea5e9 0%, #059669 100%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG Image generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}