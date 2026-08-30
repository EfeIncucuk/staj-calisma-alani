import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy: tarayicidan /api/... istegi gittiginde Vite bunu sessizce
    // backend'e (http://localhost:5000) yonlendirir.
    //
    // Faydasi: kodunda hicbir yerde "http://localhost:5000" yazmak
    // zorunda kalmazsin. axios.get("/api/country") demen yeterli.
    // Gercek projede de ayni mantik vardir (CRA'da package.json icindeki
    // "proxy" alani, ya da bir setupProxy.js dosyasi ile).
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
