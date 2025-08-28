import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      widgets: "/src/widgets",
      app: "/src/app",
      shared: "/src/shared",
      pages: "/src/pages",
      entities: "/src/entities",
      features: "/src/features",
    },
  },
});
