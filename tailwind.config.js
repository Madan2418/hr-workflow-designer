/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas:       '#080b14',
        surface:      '#0d1020',
        surfaceHover: '#131728',
        surfaceBright:'#1a1d2e',
        border:       '#1e2340',
        borderBright: '#2e3148',
        accent:       '#6366f1',
        accentHover:  '#818cf8',
        success:      '#22c55e',
        warning:      '#f59e0b',
        danger:       '#ef4444',
        info:         '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'glow-indigo': 'radial-gradient(ellipse at 50% 0%, #6366f122 0%, transparent 60%)',
      },
      animation: {
        'spin-slow':    'spin 3s linear infinite',
        'pulse-soft':   'pulse 3s ease-in-out infinite',
        'fade-in':      'fade-in 0.3s ease-out',
        'slide-up':     'slide-up 0.3s ease-out',
        'bounce-soft':  'bounce-soft 0.6s ease-out',
      },
      keyframes: {
        'fade-in':    { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up':   { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'bounce-soft':{ '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
      },
      boxShadow: {
        'glow-indigo': '0 0 20px #6366f133',
        'glow-green':  '0 0 20px #22c55e33',
        'glow-amber':  '0 0 20px #f59e0b33',
        'node':        '0 4px 24px #00000080, 0 1px 4px #00000040',
        'panel':       '0 8px 40px #00000080',
      },
    },
  },
  plugins: [],
}
