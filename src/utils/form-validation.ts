import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email({ error: 'Please enter a valid email.' }).trim().toLowerCase(),
  password: z.string().min(1, { error: 'Password is required.' }),
})

export type SignInState =
  | {
      fieldErrors?: { email?: string[]; password?: string[] }
      formError?: string
      values?: { email: string }
    }
  | undefined
