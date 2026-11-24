import type { Metadata } from 'next'
import Link from 'next/link'
import { ChangePasswordForm } from '@/features/account/ChangePasswordForm'
import { DeleteAccountSection } from '@/features/account/DeleteAccountSection'
import { DisplayNameForm } from '@/features/account/DisplayNameForm'
import { requireAuth } from '@/lib/auth'
import { ACCOUNT_PATH } from '@/utils/auth-redirect'
import type { SearchParams } from '@/types/page-params'
import type { UserStatus } from '@/generated/prisma/client'

export const metadata: Metadata = {
  title: 'My account | Cook Me',
}

const STATUS_INFO: Record<UserStatus, { label: string; text: string; className: string }> = {
  PENDING: {
    label: 'Awaiting approval',
    text: 'Every new account is approved by hand to keep spam out. You can browse as usual; commenting unlocks once you are approved.',
    className: 'bg-yellow/20 border-yellow',
  },
  APPROVED: {
    label: 'Approved',
    text: 'You can comment and share photos under any recipe.',
    className: 'bg-green/10 border-green',
  },
  BANNED: {
    label: 'Suspended',
    text: 'Your account has been suspended and your comments are hidden.',
    className: 'bg-red-50 border-red-700',
  },
}

export default async function AccountPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireAuth(ACCOUNT_PATH)
  const { confirmed } = await searchParams

  const status = STATUS_INFO[user.status]

  return (
    <div className="page-content-shadow mx-auto mt-10 w-11/12 space-y-8 rounded-xl bg-white p-5 text-black md:p-10">
      <h1 className="text-3xl font-semibold">My account</h1>

      {confirmed && (
        <p role="status" className="bg-green/10 rounded-md px-4 py-3">
          Thanks for confirming your email, {user.name}!
        </p>
      )}

      <section className={`space-y-1 rounded-md border-l-4 px-5 py-4 ${status.className}`}>
        <h2 className="font-semibold">Status: {status.label}</h2>
        <p className="text-blue-gray-dark text-sm">{status.text}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>

        <div className="text-sm">
          <div className="text-blue-gray-dark text-xs uppercase">Email</div>
          <div>{user.email}</div>
          <p className="text-blue-gray mt-1">Only you and the site admin can see your email.</p>
        </div>

        <DisplayNameForm currentName={user.name} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Change password</h2>

        <ChangePasswordForm />
      </section>

      {user.role !== 'ADMIN' && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Delete account</h2>

          <DeleteAccountSection />
        </section>
      )}

      <p className="text-blue-gray text-sm">
        Read how your data is used in the{' '}
        <Link href="/privacy" className="underline">
          privacy policy
        </Link>
        .
      </p>
    </div>
  )
}
