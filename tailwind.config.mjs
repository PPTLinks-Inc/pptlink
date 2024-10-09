/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/*", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			onxy: '#181818',
  			brightWhite: '#fbfbfb',
  			faintblack: 'rgba(255, 255, 255, 0.5)',
  			blur: 'hsl(0 0% 100% / .05)',
  			black101: 'rgba(21, 21, 21, 0.5)',
  			white25: 'rgba(255, 255, 255, 0.5)',
  			white10: 'rgba(255, 255, 255, 0.1)',
  			white70: 'rgba(255, 255, 255, 0.7)',
  			blue: 'rgba(63, 100, 233, 0.43)',
  			red: 'rgba(233, 63, 63, 0.43)',
  			golden: 'hsla(43, 100%, 50%, 0.43)',
  			dimeblack: '#0d0d0d',
  			darkGray: '#808080',
  			mediumGray: 'rgba(128, 128, 128, 0.5)',
  			lightGray: '#c5c5c5',
  			borderDark: '#383737',
  			lightBorder: '#ebebeb',
  			body: '#FFFFF0',
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
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
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
  		boxShadow: {
  			altShadow: '0px 0px 15px rgba(255,166,0,0.53)'
  		},
  		utilities: {
  			baseSpace: 'mt-5',
  			baseFont: 'sm',
  			lineHeight: 'leading-6',
  			keyframes: {
  				ping: {
  					'75%, 100%': {
  						content: '',
  						transform: 'scale(1)',
  						opacity: '0'
  					}
  				},
  				pinging: {
  					'0%': {
  						transform: 'scale(1)',
  						opacity: '1'
  					},
  					'50%': {
  						transform: 'scale(1.2)',
  						opacity: '0.6'
  					},
  					'100%': {
  						transform: 'scale(1.5)',
  						opacity: '0'
  					}
  				}
  			},
  			animation: {
  				'ping-200': 'ping 1s 200ms cubic-bezier(0, 0, 0.2, 1) infinite',
  				pinging: 'pinging 1s infinite'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	},
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1536px',
  		tall: {
  			min: '2000px'
  		},
  		maxScreen: {
  			max: '1050px'
  		},
  		maxScreenMobile: {
  			max: '768px'
  		},
  		maxSmallMobile: {
  			max: '468px'
  		}
  	},
  	plugins: []
  },
  plugins: [require("tailwindcss-animate")]
};
