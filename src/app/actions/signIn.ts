'use server'

import * as z from 'zod'
import { redirect } from 'next/navigation'
import { serverClient } from '@/lib/supabase/serverClient'
import { prismaClient } from '@/lib/prismaClient'
import { defaultPathForRole, safeNextPath } from '@/utils/auth-redirect'
import { loginSchema, type SignInState } from '@/utils/form-validation'

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
    return { formError: 'Invalid email or password.', values: { email } }
  }

  const next = safeNextPath(formData.get('next'))

  if (next) {
    redirect(next)
  }

  const dbUser = await prismaClient.user.findUnique({
    where: { authId: data.user.id },
    select: { role: true },
  })

  redirect(defaultPathForRole(dbUser?.role))
}
