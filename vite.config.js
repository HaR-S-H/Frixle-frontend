// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://frixle-backend.onrender.com',
//         changeOrigin: true, // Modify origin header to match the target
//         secure: true, // Use HTTPS for the backend
//         withCredentials: true,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       },
//     } 
//   }
// })

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://frixle-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        ws: true
      }
    }
  }
})
