import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Emmanuel Prouvèze - Enterprise Sales Leader'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          padding: '60px',
        }}
      >
        {/* Left side - Photo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '60px',
          }}
        >
          <img
            src="https://emmanuel.prouveze.fr/images/headshot.jpg"
            alt="Emmanuel Prouvèze"
            width={280}
            height={280}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #e2e8f0',
            }}
          />
        </div>

        {/* Right side - Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '16px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Emmanuel Prouvèze
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#475569',
              marginBottom: '24px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Enterprise Sales Leader
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: '#64748b',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              20+ years in Japan
            </div>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
              }}
            />
            <div
              style={{
                fontSize: 24,
                color: '#64748b',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Building AI tools
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '32px',
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                fontSize: 20,
                color: '#ffffff',
                fontWeight: 600,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              View Projects & Writing →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
