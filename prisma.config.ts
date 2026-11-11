import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // CLI only (db push, studio, …): needs a session/direct connection, because the
    // transaction pooler (port 6543) breaks schema commands. The app uses DATABASE_URL.
    // Falls back to DATABASE_URL so `prisma generate` (postinstall in CI/Vercel) still works.
    url: process.env.DIRECT_URL ?? env('DATABASE_URL'),
  },
})
