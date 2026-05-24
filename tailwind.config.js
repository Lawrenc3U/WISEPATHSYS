module.exports = {
  content: ['./App.{js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#7C3AED',
        accent: '#EC4899',
        background: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E5E7EB',
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
