import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 1. Carga todas las vars del .env correspondiente al mode
  const env = loadEnv(mode, process.cwd())
  // 2. Filtra sólo las que empiezan por VITE_ (las expuestas al cliente)
  const processEnv = Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('VITE_'))
  )

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env': JSON.stringify(processEnv),
    },
  }
})
