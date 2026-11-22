'use server'

import * as z from 'zod'
import { serverClient } from '@/lib/supabase/serverClient'
import { prismaClient } from '@/lib/prismaClient'
import { defaultPathForRole, safeNextPath } from '@/utils/auth-redirect'
import {
  loginSchema,
  type SignInState,
  signUpSchema,
  type SignUpState,
  emailSchema,
  type ForgotPasswordState,
  newPasswordSchema,
  type ResetPasswordState,
} from '@/utils/form-validation'
import { adminClient } from '@/lib/supabase/adminClient'
import { authConfirmUrl } from '@/lib/users'
import { refresh } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

/**
 * Signs the user in. On success returns `redirectTo` instead of redirecting, so the client can
 * refresh the header's viewer data before navigating.
 */
export async function signIn(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '')

  const result = loginSchema.safeParse({
    email,
    password: formData.get('password'),
  })

  if (!result.success) {
    return { fieldErrors: z.flattenError(result.error).fieldErrors, values: { email } }
  }

  const supabase = await serverClient()

  const { data, error } = await supabase.auth.signInWithPassword(result.data)

  if (error) {
    if (error.code === 'email_not_confirmed') {
      return {
        formError: 'Please confirm your email first. Check your inbox for the link.',
        values: { email },
      }
    }

    return { formError: 'Invalid email or password.', values: { email } }
  }

  const dbUser = await prismaClient.user.findUnique({
    where: { authId: data.user.id },
    select: { role: true },
  })

  // Auth user without an app account (e.g. a sign-up that failed half-way): don't leave a dangling session
  if (!dbUser) {
    await supabase.auth.signOut()
    return { formError: 'No account found for this email.', values: { email } }
  }

  return { redirectTo: safeNextPath(formData.get('next')) ?? defaultPathForRole(dbUser.role) }
}

/**
 * Creates the Supabase auth user (which sends the confirmation email) and the matching
 * `PENDING` app user. The account becomes usable once the email is confirmed and an admin approves it.
 */
export async function signUp(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const values = {
    email: String(formData.get('email') ?? ''),
    name: String(formData.get('name') ?? ''),
    joinReason: String(formData.get('joinReason') ?? ''),
  }

  const result = signUpSchema.safeParse({
    ...values,
    password: formData.get('password'),
    consent: formData.get('consent'),
  })

  if (!result.success) {
    return { fieldErrors: z.flattenError(result.error).fieldErrors, values }
  }

  const { email, password, name, joinReason } = result.data
  const supabase = await serverClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: await authConfirmUrl(),
      data: { display_name: name },
    },
  })

  if (error) {
    if (error.code === 'weak_password') {
      return { fieldErrors: { password: [error.message] }, values }
    }

    if (error.code === 'over_email_send_rate_limit') {
      return {
        formError: 'Too many sign-ups right now. Please try again in an hour.',
        values,
      }
    }

    console.error('Sign-up failed:', error)
    return { formError: 'Could not create your account. Please try again.', values }
  }

  const authUser = data.user

  // The email is already registered and confirmed: Supabase returns a placeholder user with no
  // identities and sends no email. Show the same screen so sign-up can't reveal who has an account.
  if (!authUser || authUser.identities?.length === 0) {
    return { checkEmail: email }
  }

  try {
    // Upsert: signing up again with an unconfirmed email reuses the same auth user
    await prismaClient.user.upsert({
      where: { authId: authUser.id },
      create: { authId: authUser.id, email, name, joinReason, status: 'PENDING' },
      update: { name, joinReason },
    })
  } catch (dbError) {
    console.error('Failed to create user row, rolling back auth user:', dbError)
    await adminClient().auth.admin.deleteUser(authUser.id)

    return { formError: 'Could not create your account. Please try again.', values }
  }

  return { checkEmail: email }
}

/**
 * Ends the session. Doesn't redirect: the caller decides whether to leave the current page
 * (only needed on pages that require sign-in).
 */
export async function signOut() {
  const supabase = await serverClient()

  await supabase.auth.signOut()

  refresh()
}

/**
 * Sends a password reset link. Always reports success so the form can't be used to check
 * which emails have an account.
 */
export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get('email') ?? '')
  const result = emailSchema.safeParse({ email })

  if (!result.success) {
    return { fieldErrors: z.flattenError(result.error).fieldErrors, values: { email } }
  }

  const supabase = await serverClient()

  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: await authConfirmUrl(),
  })

  if (error?.code === 'over_email_send_rate_limit') {
    return {
      formError: 'Too many emails sent recently. Please try again in an hour.',
      values: { email },
    }
  }

  if (error) {
    console.error('Password reset request failed:', error)
  }

  return { sent: true, values: { email } }
}

/**
 * Sets a new password for the user signed in through the reset link (recovery session).
 */
export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const result = newPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!result.success) {
    return { fieldErrors: z.flattenError(result.error).fieldErrors }
  }

  const user = await getCurrentUser()

  if (!user) {
    return { formError: 'Your reset link has expired. Please request a new one.' }
  }

  const supabase = await serverClient()
  const { error } = await supabase.auth.updateUser({ password: result.data.password })

  if (error) {
    if (error.code === 'same_password') {
      return { fieldErrors: { password: ['Choose a password different from your old one.'] } }
    }

    if (error.code === 'weak_password') {
      return { fieldErrors: { password: [error.message] } }
    }

    console.error('Password reset failed:', error)
    return { formError: 'Could not update your password. Please try again.' }
  }

  return { redirectTo: defaultPathForRole(user.role) }
}
