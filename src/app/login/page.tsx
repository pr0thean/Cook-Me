import { LoginForm } from '@/features/login/LoginForm'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 w-full space-y-6 rounded-xl bg-white p-10 text-center shadow-md md:max-w-md">
        <div>
          <h2 className="text-3xl font-bold text-black">Admin Login</h2>
          <p className="text-blue-gray mt-2 text-sm">Sign in to manage recipes</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
