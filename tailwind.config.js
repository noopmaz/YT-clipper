/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        void: '#050507',
        surface: '#0d0d12',
        panel: '#111118',
        border: '#1e1e2a',
        accent: '#6c47ff',
        'accent-bright': '#8b6aff',
        'accent-dim': '#3d2a99',
        neon: '#00f5c4',
        'neon-dim': '#00a882',
        danger: '#ff3b5c',
        warn: '#ffa940',
        muted: '#4a4a6a',
        ghost: '#2a2a3a',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(108,71,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.03) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,71,255,0.25), transparent)',
        'card-glow': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(108,71,255,0.1), transparent)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'progress': 'progressFill 0.3s ease',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108,71,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(108,71,255,0.6)' },
        },
      },
      boxShadow: {
        'accent': '0 0 30px rgba(108,71,255,0.3)',
        'accent-lg': '0 0 60px rgba(108,71,255,0.4)',
        'neon': '0 0 20px rgba(0,245,196,0.3)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
};
