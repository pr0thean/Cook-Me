export const AUTH_PATH = '/auth'
export const ACCOUNT_PATH = '/account'

export type AuthMode = 'login' | 'signup'

/**
 * Only same-origin relative paths are allowed, so `?next=` can't be used as an open redirect
 * ("//evil.com" and "/\evil.com" are treated as absolute URLs by browsers).
 */
export function safeNextPath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return undefined

  return value
}

/**
 * Builds a link to the auth page.
 * @param next path to return to after signing in
 * @param mode which form to show (login is the default, so it's left out of the URL)
 */
export function authUrl(next?: string, mode: AuthMode = 'login') {
  const params = new URLSearchParams()
  const safeNext = safeNextPath(next)

  if (mode === 'signup') params.set('mode', 'signup')
  if (safeNext) params.set('next', safeNext)

  const query = params.toString()

  return query ? `${AUTH_PATH}?${query}` : AUTH_PATH
}

export function defaultPathForRole(role: 'USER' | 'ADMIN' | undefined) {
  return role === 'ADMIN' ? '/admin' : '/'
}

/** Pages that require a signed-in user; signing out on one of them sends the user home */
export function isProtectedPath(pathname: string) {
  return ['/admin', ACCOUNT_PATH].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

/** Email link types handled by `/auth/confirm` (sign-up confirmation and password reset) */
export const EMAIL_LINK_TYPES = ['email', 'signup', 'recovery'] as const
export type EmailLinkType = (typeof EMAIL_LINK_TYPES)[number]

export function isEmailLinkType(value: unknown): value is EmailLinkType {
  return EMAIL_LINK_TYPES.includes(value as EmailLinkType)
}
