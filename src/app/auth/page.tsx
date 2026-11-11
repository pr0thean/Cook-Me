import { LoginForm } from '@/features/login/LoginForm'
import { getCurrentUser } from '@/lib/auth'
import { defaultPathForRole, safeNextPath } from '@/utils/auth-redirect'
import { redirect } from 'next/navigation'
import type { SearchParams } from '@/types/page-params'

export default async function AuthPage({ searchParams }: { searchParams: SearchParams }) {
  const next = safeNextPath((await searchParams).next) // page to send the user back to after they sign in
  const user = await getCurrentUser()

  if (user) {
    redirect(next ?? defaultPathForRole(user.role))
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 w-full space-y-6 rounded-xl bg-white p-10 text-center shadow-md md:max-w-md">
        <div>
          <h2 className="text-3xl font-bold text-black">Admin Login</h2>
          <p className="text-blue-gray mt-2 text-sm">Sign in to manage recipes</p>
        </div>

        <LoginForm next={next} />
      </div>
    </div>
  )
}
