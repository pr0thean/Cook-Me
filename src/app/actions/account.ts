'use server'

import * as z from 'zod'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { prismaClient } from '@/lib/prismaClient'
import { serverClient } from '@/lib/supabase/serverClient'
import { deleteUserAccount } from '@/lib/users'
import { ACCOUNT_PATH } from '@/utils/auth-redirect'
import {
  changePasswordSchema,
  displayNameSchema,
  type ChangePasswordState,
  type DisplayNameState,
} from '@/utils/form-validation'

const SIGNED_OUT_ERROR = 'Your session has expired. Please sign in again.'

export async function updateDisplayName(
  _prevState: DisplayNameState,
  formData: FormData
): Promise<DisplayNameState> {
  const name = String(formData.get('name') ?? '')
  const result = displayNameSchema.safeParse({ name })

  if (!result.success) {
    return { fieldErrors: z.flattenError(result.error).fieldErrors, values: { name } }
  }

  const user = await getCurrentUser()

  if (!user) return { formError: SIGNED_OUT_ERROR, values: { name } }

  await prismaClient.user.update({
    where: { id: user.id },
    data: { name: result.data.name },
  })

  // TODO(Phase 2): revalidate the recipe pages the user posted on, so their new name shows up
  revalidatePath(ACCOUNT_PATH)

  return { success: true, values: { name: result.data.name } }
}

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const result = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!result.success) {
    return { fieldErrors: z.flattenError(result.error).fieldErrors }
  }

  const user = await getCurrentUser()

  if (!user) return { formError: SIGNED_OUT_ERROR }

  const supabase = await serverClient()

  // Re-check the current password so a borrowed, already signed-in device can't take over the account
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: result.data.currentPassword,
  })

  if (verifyError) {
    return { fieldErrors: { currentPassword: ['Current password is incorrect.'] } }
  }

  const { error } = await supabase.auth.updateUser({ password: result.data.password })

  if (error) {
    if (error.code === 'same_password') {
      return { fieldErrors: { password: ['Choose a password different from your current one.'] } }
    }

    if (error.code === 'weak_password') {
      return { fieldErrors: { password: [error.message] } }
    }

    console.error('Password change failed:', error)
    return { formError: 'Could not change your password. Please try again.' }
  }

  return { success: true }
}

/**
 * Deletes the signed-in user's account and everything they posted.
 * Admins can't delete themselves here, so the site can't be left without an admin by accident.
 */
export async function deleteMyAccount(): Promise<{ error?: string }> {
  const user = await getCurrentUser()

  if (!user) return { error: SIGNED_OUT_ERROR }

  if (user.role === 'ADMIN') {
    return { error: 'Admin accounts cannot be deleted from this page.' }
  }

  try {
    await deleteUserAccount(user)
  } catch (error) {
    console.error('Account deletion failed:', error)
    return { error: 'Could not delete your account. Please try again.' }
  }

  // The auth user is gone; this just clears the session cookies
  const supabase = await serverClient()
  await supabase.auth.signOut({ scope: 'local' })

  return {}
}
