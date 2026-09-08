module.exports = {
  content: ['./App.{js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E3F2FD',
        secondary: '#FFFCE1',
        accent: '#95BDD7',
        background: '#E3F2FD',
        card: '#FFFCE1',
        border: '#95BDD7',
        text: '#111827',
        muted: '#6B7280',
        success: '#22C55E',
        warning: '#F59E0B',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.06)',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
