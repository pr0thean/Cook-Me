import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy policy | Cook Me',
}

export default function PrivacyPage() {
  return (
    <div className="page-content-shadow mx-auto mt-10 w-11/12 rounded-xl bg-white p-5 text-black md:p-10">
      <div className="document">
        <h1 className="mb-4 text-3xl font-semibold">Privacy policy</h1>

        <p>
          Cook Me is a personal, non-commercial recipe site. You can browse it without an account.
          This page explains what is stored when you create an account and share your cooking.
        </p>

        <h2>What we store</h2>
        <ul>
          <li>
            <strong>Email address</strong>: to sign you in, confirm your account and send password
            reset links. It is never shown publicly; only you and the site admin can see it.
          </li>
          <li>
            <strong>Password</strong>: stored only as a secure hash by our authentication provider.
            Nobody, including the admin, can read it.
          </li>
          <li>
            <strong>Display name</strong>: shown publicly next to your comments. You can change it
            at any time.
          </li>
          <li>
            <strong>Why you want to join</strong> (optional): seen only by the admin, to approve new
            accounts.
          </li>
          <li>
            <strong>Comments and photos</strong>: the text and photos you share under recipes are{' '}
            <strong>public</strong>, and your photos also appear on the Inspirations page and the
            home page. Photos are re-encoded in your browser before upload, which removes hidden
            metadata such as GPS location.
          </li>
        </ul>

        <h2>Why</h2>
        <p>
          The data is used only to run the community features of this site: signing in, approving
          accounts, showing your comments and keeping out spam. It is not sold, shared for marketing
          or used for advertising, and there are no analytics or tracking cookies.
        </p>

        <h2>Where it is stored</h2>
        <p>
          Accounts, comments and photos are stored with Supabase, the database, authentication and
          file hosting provider this site runs on. The site sets only the cookies needed to keep you
          signed in.
        </p>

        <h2>How long</h2>
        <p>
          Your data is kept for as long as you have an account. A comment is removed as soon as you
          delete it.
        </p>

        <h2>Deleting your data</h2>
        <p>
          You can delete your account at any time on the{' '}
          <Link href="/account" className="underline">
            My account
          </Link>{' '}
          page. This permanently removes your email, display name, and all your comments and photos.
          You can also edit or delete individual comments yourself.
        </p>
      </div>
    </div>
  )
}
