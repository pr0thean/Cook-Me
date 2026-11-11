export const AUTH_PATH = '/auth'

/**
 * Only same-origin relative paths are allowed, so `?next=` can't be used as an open redirect
 * ("//evil.com" and "/\evil.com" are treated as absolute URLs by browsers).
 */
export function safeNextPath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return undefined

  return value
}

export function authUrl(next?: string) {
  const safeNext = safeNextPath(next)

  return safeNext ? `${AUTH_PATH}?next=${encodeURIComponent(safeNext)}` : AUTH_PATH
}

export function defaultPathForRole(role: 'USER' | 'ADMIN' | undefined) {
  return role === 'ADMIN' ? '/admin' : '/'
}
