import { QueryProvider } from '@/features/providers/QueryProvider'
import { ReactNode } from 'react'

export default function RecipesLayout({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}
