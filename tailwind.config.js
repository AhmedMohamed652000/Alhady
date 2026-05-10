/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/admin/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Admin design system palette — Midnight Pro
        adm: {
          bg:        '#0D0F1A',
          surface:   '#12152A',
          surface2:  '#1A1D30',
          surface3:  '#222542',
          accent:    '#6C63FF',
          accent2:   '#a78bfa',
          text:      '#E8EAF6',
          muted:     '#7B82A8',
          subtle:    '#4A5074',
          success:   '#22d3a5',
          warning:   '#f59e0b',
          danger:    '#f43f5e',
          info:      '#38bdf8',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm:    '0 2px 8px rgba(0,0,0,0.4)',
        card:  '0 4px 24px rgba(0,0,0,0.5)',
        glow:  '0 0 24px rgba(108,99,255,0.25)',
        modal: '0 25px 60px rgba(0,0,0,0.7)',
      },
      borderRadius: {
        xl:  '18px',
        '2xl': '24px',
      },
      animation: {
        'fade-in':   'fadeIn 0.2s ease-out',
        'slide-up':  'slideUp 0.3s ease-out',
        'shimmer':   'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
      },
    },
  },
  plugins: [],
}
