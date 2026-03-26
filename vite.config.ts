import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
//import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    //VitePWA({
      //registerType: "autoUpdate",
      //workbox: { navigateFallbackDenylist: [/^\/~oauth/] },
     // //manifest: {
       // //name: "ENEM Focus – Rotina de Estudos",
        //short_name: "ENEM Focus",
        //description: "Sua companheira de estudos para o ENEM",
        //theme_color: "#6c63ff",
        //background_color: "#0c1120",
        //display: "standalone",
        //orientation: "portrait",
        //icons: [{ src: "/favicon.ico", sizes: "64x64", type: "image/x-icon" }],
      //},
    //}),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
