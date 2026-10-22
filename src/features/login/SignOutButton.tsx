import { signOut } from '@/app/actions/signOut'

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
      >
        Sign Out
      </button>
    </form>
  )
}
