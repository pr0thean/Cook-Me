import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/features/auth/LoginForm'
import { ResetPasswordDialog } from '@/features/auth/ResetPasswordDialog'
import { SignUpForm } from '@/features/auth/SignUpForm'
import { getCurrentUser } from '@/lib/auth'
import { authUrl, defaultPathForRole, safeNextPath } from '@/utils/auth-redirect'
import type { SearchParams } from '@/types/page-params'

export const metadata: Metadata = {
  title: 'Sign in | Cook Me',
}

const ERROR_MESSAGES: Record<string, string> = {
  'reset-expired': 'Your password reset link has expired. Use "Forgot password?" to get a new one.',
}

/**
 * Sign in / sign up in one place.
 * - `?mode=signup` shows the sign-up form (login is the default)
 * - `?next=/path` returns the user there after signing in
 * - `?dialog=reset-password` opens the set-new-password dialog (where reset email links land)
 * - `?error=…` shows a message (currently only `reset-expired`)
 */
export default async function AuthPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const next = safeNextPath(params.next) // page to send the user back to after they sign in
  const mode = params.mode === 'signup' ? 'signup' : 'login'
  const user = await getCurrentUser()

  const isResettingPassword = params.dialog === 'reset-password'

  if (user && !isResettingPassword) {
    redirect(next ?? defaultPathForRole(user.role))
  }

  const errorKey = isResettingPassword && !user ? 'reset-expired' : params.error
  const errorMessage = errorKey ? ERROR_MESSAGES[errorKey] : undefined

  const isSignUp = mode === 'signup'

  return (
    <div className="flex min-h-screen items-center justify-center py-10">
      <div className="mx-4 w-full space-y-6 rounded-xl bg-white p-6 text-center shadow-md sm:p-10 md:max-w-md">
        <div>
          <h2 className="text-3xl font-bold text-black">
            {isSignUp ? 'Create an account' : 'Sign in'}
          </h2>
          <p className="text-blue-gray mt-2 text-sm">
            {isSignUp
              ? 'Join to share photos of the dishes you cooked'
              : 'Welcome back! Sign in to share your cooking'}
          </p>
        </div>

        {errorMessage && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </p>
        )}

        {/* key: reset the form state when switching modes */}
        {isSignUp ? <SignUpForm key="signup" /> : <LoginForm key="login" next={next} />}

        <p className="text-blue-gray-dark text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link
            href={authUrl(next, isSignUp ? 'login' : 'signup')}
            replace
            scroll={false}
            className="text-black underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </div>

      {isResettingPassword && user && (
        <ResetPasswordDialog closePath={defaultPathForRole(user.role)} />
      )}
    </div>
  )
}
