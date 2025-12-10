import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const apiBase = process.env.VITE_API_BASE_URL ?? "http://8.222.195.9:8080";
const apiOrigin = (() => {
  try {
    return new URL(apiBase).origin;
  } catch {
    return apiBase;
  }
})();

const connectSources = Array.from(
  new Set([
    "'self'",
    apiOrigin,
    "http://8.222.195.9:8080",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "https:",
  ])
);

const baseCspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src ${connectSources.join(" ")}`,
  "frame-ancestors 'none'",
];

const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Content-Security-Policy": `${baseCspDirectives.join("; ")};`,
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: securityHeaders,
  },
  preview: {
    headers: securityHeaders,
  },
});
