export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_API_MOCKING === 'true') {
    require('./mocks/index.ts')
    console.log('[instrumentation][register] API mocking enabled, starting.')
  }
}
