interface LogoProps {
  variant?: 'default' | 'light'
}

export function Logo({ variant = 'default' }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="SkinCode"
      className={`logo ${variant === 'light' ? 'logo--light' : ''}`}
    />
  )
}
