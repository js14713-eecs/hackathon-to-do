import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 项目站点部署在 /<repo>/ 子路径下，资源路径必须跟着变
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
