import * as z from 'zod'

export const PASSWORD_MIN_LENGTH = 8
export const DISPLAY_NAME_MAX_LENGTH = 50
export const JOIN_REASON_MAX_LENGTH = 500

const emailField = z.email({ error: 'Please enter a valid email.' }).trim().toLowerCase()

const newPasswordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  })
  .max(72, { error: 'Password is too long.' }) // bcrypt (used by Supabase) ignores anything past 72 bytes

const displayNameField = z
  .string()
  .trim()
  .min(1, { error: 'Display name is required.' })
  .max(DISPLAY_NAME_MAX_LENGTH, {
    error: `Display name must be at most ${DISPLAY_NAME_MAX_LENGTH} characters.`,
  })

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { error: 'Password is required.' }),
})

export const signUpSchema = z.object({
  email: emailField,
  password: newPasswordField,
  name: displayNameField,
  joinReason: z
    .string()
    .trim()
    .max(JOIN_REASON_MAX_LENGTH, {
      error: `Please keep it under ${JOIN_REASON_MAX_LENGTH} characters.`,
    })
    .transform((value) => value || null),
  consent: z.literal('on', { error: 'You need to accept the privacy policy.' }),
})

export const emailSchema = z.object({ email: emailField })

export const displayNameSchema = z.object({ name: displayNameField })

export const newPasswordSchema = z
  .object({
    password: newPasswordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: 'Current password is required.' }),
    password: newPasswordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

/**
 * Shared shape of a `useActionState` form result.
 * `values` echoes back what the user typed (never passwords) so the form can be re-filled after an error.
 */
export type FormState<Field extends string, Values = Partial<Record<Field, string>>> =
  | {
      fieldErrors?: Partial<Record<Field, string[]>>
      formError?: string
      values?: Values
    }
  | undefined

export type SignInState =
  | (NonNullable<FormState<'email' | 'password', { email: string }>> & {
      /** Set on success: where the client should navigate (it refreshes the header first) */
      redirectTo?: string
    })
  | undefined

export type SignUpState =
  | (NonNullable<FormState<'email' | 'password' | 'name' | 'joinReason' | 'consent'>> & {
      /** Set on success: the "check your email" screen is shown for this address */
      checkEmail?: string
    })
  | undefined

export type ForgotPasswordState =
  | (NonNullable<FormState<'email'>> & {
      sent?: boolean
    })
  | undefined

export type ResetPasswordState =
  | (NonNullable<FormState<'password' | 'confirmPassword'>> & {
      redirectTo?: string
    })
  | undefined

export type DisplayNameState =
  | (NonNullable<FormState<'name'>> & {
      success?: boolean
    })
  | undefined

export type ChangePasswordState =
  | (NonNullable<FormState<'currentPassword' | 'password' | 'confirmPassword'>> & {
      success?: boolean
    })
  | undefined
