import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./styles/tokens.css";
import "./index.css";
import App from "./App";

const requiredEnvVars = ["VITE_API_BASE_URL"] as const;
for (const key of requiredEnvVars) {
	if (!import.meta.env[key]) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
