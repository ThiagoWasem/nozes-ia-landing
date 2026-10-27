interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'symbol'
  tone?: 'graphite' | 'evergreen' | 'light'
  className?: string
  animated?: boolean
}

const toneMap = {
  graphite: { color: '#1B1C1B', gap: '#F2F0EA' },
  evergreen: { color: '#1F3B33', gap: '#F2F0EA' },
  light: { color: '#F2F0EA', gap: '#1F3B33' },
}

function Mark({ color, gap }: { color: string; gap: string }) {
  return (
    <g aria-hidden="true">
      <rect x="2" y="2" width="60" height="60" rx="18" fill={color} />
      <path
        d="M30 1.5C43 12 43.5 22.2 32 32C20.4 41.9 20.8 52 34 62.5"
        fill="none"
        stroke={gap}
        strokeWidth="4.6"
        strokeLinecap="round"
      />
    </g>
  )
}

export function Logo({
  variant = 'horizontal',
  tone = 'graphite',
  className = '',
  animated = false,
}: LogoProps) {
  const colors = toneMap[tone]

  if (variant === 'symbol') {
    return (
      <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Nozes Ink">
        <Mark {...colors} />
      </svg>
    )
  }

  if (variant === 'compact') {
    return (
      <svg className={className} viewBox="0 0 116 132" role="img" aria-label="Nozes Ink">
        <g transform="translate(26 0)">
          <Mark {...colors} />
        </g>
        <text
          x="58"
          y="92"
          fill={colors.color}
          textAnchor="middle"
          fontFamily="Space Grotesk, sans-serif"
          fontSize="23"
          fontWeight="700"
          letterSpacing="0.5"
        >
          NOZES
        </text>
        <text
          x="58"
          y="119"
          fill={colors.color}
          textAnchor="middle"
          fontFamily="Space Grotesk, sans-serif"
          fontSize="19"
          fontWeight="400"
          letterSpacing="9"
        >
          INK
        </text>
      </svg>
    )
  }

  return (
    <svg
      className={`${animated ? 'logo-entry' : ''} ${className}`}
      viewBox="0 0 316 72"
      role="img"
      aria-label="Nozes Ink"
    >
      <g transform="translate(4 4)">
        <Mark {...colors} />
      </g>
      <text
        x="88"
        y="46"
        fill={colors.color}
        fontFamily="Space Grotesk, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="0.8"
      >
        NOZES
      </text>
      <text
        x="220"
        y="46"
        fill={colors.color}
        fontFamily="Space Grotesk, sans-serif"
        fontSize="30"
        fontWeight="400"
        letterSpacing="10"
      >
        INK
      </text>
    </svg>
  )
}
