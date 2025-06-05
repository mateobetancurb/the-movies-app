/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
    	extend: {
    		colors: {
    			primary: {
    				'50': '#eef2ff',
    				'100': '#e0e7ff',
    				'200': '#c7d2fe',
    				'300': '#a5b4fc',
    				'400': '#818cf8',
    				'500': '#6366f1',
    				'600': '#4f46e5',
    				'700': '#4338ca',
    				'800': '#3730a3',
    				'900': '#312e81',
    				'950': '#172554',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				'50': '#fef2f2',
    				'100': '#fee2e2',
    				'200': '#fecaca',
    				'300': '#fca5a5',
    				'400': '#f87171',
    				'500': '#ef4444',
    				'600': '#dc2626',
    				'700': '#b91c1c',
    				'800': '#991b1b',
    				'900': '#7f1d1d',
    				'950': '#450a0a',
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			accent: {
    				'50': '#fffbeb',
    				'100': '#fef3c7',
    				'200': '#fde68a',
    				'300': '#fcd34d',
    				'400': '#fbbf24',
    				'500': '#f59e0b',
    				'600': '#d97706',
    				'700': '#b45309',
    				'800': '#92400e',
    				'900': '#78350f',
    				'950': '#451a03',
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		animation: {
    			'slide-up': 'slideUp 0.3s ease-out forwards',
    			'fade-in': 'fadeIn 0.4s ease-in forwards',
    			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    		},
    		keyframes: {
    			slideUp: {
    				'0%': {
    					transform: 'translateY(10px)',
    					opacity: 0
    				},
    				'100%': {
    					transform: 'translateY(0)',
    					opacity: 1
    				}
    			},
    			fadeIn: {
    				'0%': {
    					opacity: 0
    				},
    				'100%': {
    					opacity: 1
    				}
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
};
