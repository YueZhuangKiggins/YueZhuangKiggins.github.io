import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

const isSandbox = !!process.env.LOVABLE_SANDBOX;

export default defineConfig({
  base: "/",
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: isSandbox
    ? { host: "::", port: Number(process.env.PORT) || 8080, strictPort: true }
    : { host: "::", port: 8080 },
});
