/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class', // Enables dark mode using the "dark" class
	content: ['./src/**/*.{html,js,jsx,ts,tsx}'], // Ensure all files are included
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#A0D2EB',
					light: '#CDE6F4',
					darkhover: '#77B3D0',
					hover: '#91C6E1',
					dark: '#4A90A4',
				},
				secondary: {
					DEFAULT: '#FFDAC1',
					light: '#FFEAD8',
					darkhover: '#FFBC91',
					hover: '#FFCFAB',
					dark: '#D99171',
				},
				background: {
					DEFAULT: '#FFFFFF',
					dark: '#1A1A1A',
				},
				surface: {
					DEFAULT: '#F9FAFB',
					dark: '#2A2A2A',
				},
				'text-primary': {
					DEFAULT: '#2D2D2D',
					dark: '#E4E4E4',
				},
				error: {
					DEFAULT: '#E63946',
					dark: '#FF6B6B',
				},
				success: {
					DEFAULT: '#43A047',
					dark: '#63D297',
				},
				'on-primary': {
					DEFAULT: '#2D2D2D',
					dark: '#E4E4E4',
				},
				'on-secondary': {
					DEFAULT: '#2D2D2D',
					dark: '#E4E4E4',
				},
			},
			fontFamily: {
				heading: ['Poppins', 'sans-serif'], // Headings
				body: ['Roboto', 'sans-serif'], // Body text
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
	],
};
