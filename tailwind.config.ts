import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Tajawal', 'sans-serif'],
        headline: ['Tajawal', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Custom colors based on user's CSS & HSL variables
        'header-bg': 'rgba(var(--header-bg-rgb), 0.95)', // Updated opacity slightly
        'header-fg': 'hsl(var(--header-fg-hsl))',
        'nav-link': 'hsl(var(--nav-link-hsl))', // Will be overridden by text-white in Navbar
        'nav-link-hover': 'hsl(var(--nav-link-hover-hsl))', // Will be overridden
        'nav-link-border': 'hsl(var(--nav-link-border-hsl))',
        'app-red': '#B40404', 
        'app-gold': '#f1c40f', 
        'gradient-pink': '#ff007f',
        'gradient-orange': '#ff7f00',
        'gradient-purple': '#ff00ff',
        'card-content-bg': 'rgba(var(--card-content-bg-rgb), 0.9)',
        'card-content-bg-hover': 'rgba(var(--card-content-bg-rgb), 0.95)',
        'card-content-fg': 'hsl(var(--card-content-fg-hsl))',
        'card-content-hover-fg': 'hsl(var(--card-content-hover-fg-hsl))',
        'currency-jod': '#2ecc71', // Green for JOD lozenge
        'currency-eur': '#3498db', // Blue for EUR lozenge
        'currency-usd': '#B40404', // Red for USD lozenge (Changed from yellow)
        'social-whatsapp': '#25D366',
        'social-instagram': '#E4405F', // Simplified pink/red for Instagram
        'social-facebook': '#1877F2',
        'header-info-bg': '#3b3e51', // Darker gray for time/currency boxes
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'header-footer': '0 2px 8px rgba(0, 0, 0, 0.25)', 
        'nav': '0 2px 6px rgba(0, 0, 0, 0.2)', 
        'message': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'form-container': '0 10px 25px rgba(0, 0, 0, 0.2)',
        // Removed 'card-main' and 'card-main-hover' as they are from the old design
        // Standard shadows like 'lg' and 'xl' will be used for cards
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        modalFadeIn: { 
          'from': { opacity: '0', transform: 'translateY(-50px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'modal-fade-in': 'modalFadeIn 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
