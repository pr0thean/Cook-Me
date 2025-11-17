'use client'

import { browserClient } from 'lib/supabase/browserClient'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = browserClient()

    await supabase.auth.signOut()

    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
    >
      Sign Out
    </button>
  )
}
