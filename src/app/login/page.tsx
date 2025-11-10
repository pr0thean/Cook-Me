import { LoginForm } from '@features/login/LoginForm'
import { getCurrentUser } from '@lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Sign in to manage recipes</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
