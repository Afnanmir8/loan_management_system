module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1e40af',
          secondary: '#0891b2',
          accent: '#06b6d4',
          danger: '#dc2626',
          warning: '#f59e0b',
          success: '#10b981',
          dark: '#0f172a',
          light: '#f8fafc',
        },
        backgroundImage: {
          'gradient-hero': 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)',
          'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
        },
        boxShadow: {
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
          'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        spacing: {
          '128': '32rem',
        },
      },
    },
    plugins: [],
  };
