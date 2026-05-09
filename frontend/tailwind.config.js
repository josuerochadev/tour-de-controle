/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				paper: "#fef3e2",
				"paper-soft": "#fef9ee",
				"paper-2": "#f7e9d3",
				"paper-3": "#efe0c4",
				ink: "#1c1917",
				"ink-2": "#3f3a36",
				"ink-3": "#6b645e",
				"ink-4": "#706860",
				signal: "#dc2626",
				"signal-deep": "#991b1b",
				beacon: "#f59e0b",
				"beacon-soft": "#fbbf24",
				ok: "#059669",
				"ok-soft": "#d1fae5",
				"ok-deep": "#065f46",
				danger: "#dc2626",
				"danger-soft": "#fee2e2",
				sand: "#efe0c4",
				mist: "#706860",
			},
			fontFamily: {
				sans: ["'Inter Variable'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
				display: ["'JetBrains Mono Variable'", "'JetBrains Mono'", "ui-monospace", "monospace"],
				mono: ["'JetBrains Mono Variable'", "'JetBrains Mono'", "ui-monospace", "monospace"],
			},
			borderRadius: {
				"2xl": "1.5rem",
				"3xl": "1.75rem",
			},
			keyframes: {
				"tdc-pulse": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.4" },
				},
				"tdc-rotate": {
					from: { transform: "rotate(0deg)" },
					to: { transform: "rotate(360deg)" },
				},
				"slide-in": {
					from: { transform: "translateX(100%)", opacity: "0" },
					to: { transform: "translateX(0)", opacity: "1" },
				},
			},
			animation: {
				"tdc-pulse": "tdc-pulse 1.5s ease-in-out infinite",
				"tdc-rotate": "tdc-rotate 24s linear infinite",
				"slide-in": "slide-in 0.3s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
