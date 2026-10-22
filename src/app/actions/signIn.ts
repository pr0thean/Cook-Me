'use server'

import * as z from 'zod'
import { redirect } from 'next/navigation'
import { serverClient } from '@/lib/supabase/serverClient'
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

  const { error } = await supabase.auth.signInWithPassword(result.data)

  if (error) {
    return { formError: 'Invalid email or password.', values: { email } }
  }

  redirect('/admin')
}
