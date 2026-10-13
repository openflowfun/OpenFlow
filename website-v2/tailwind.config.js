/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050510',
        'bg-2': '#0a0520',
        purple: {
          deep: '#1a0b2e',
          accent: '#7b2fff',
        },
        blue: {
          dark: '#0b1a3d',
          mid: '#0088ff',
        },
        cyan: {
          flow: '#00f0ff',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-flow': 'linear-gradient(90deg, #00f0ff, #0088ff)',
        'gradient-flow-diagonal': 'linear-gradient(135deg, #00f0ff, #7b2fff)',
        'gradient-dark': 'linear-gradient(135deg, #050510, #0a0520, #1a0b2e)',
        'gradient-card': 'linear-gradient(135deg, rgba(0,240,255,0.05), rgba(0,136,255,0.03))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(0,240,255,0.3)' },
          to: { boxShadow: '0 0 40px rgba(0,240,255,0.7), 0 0 80px rgba(0,136,255,0.3)' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 30px rgba(0,240,255,0.4)',
        'glow-blue': '0 0 30px rgba(0,136,255,0.4)',
        'glow-purple': '0 0 30px rgba(123,47,255,0.4)',
        'card': '0 4px 40px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
