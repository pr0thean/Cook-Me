'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { browserClient } from 'lib/supabase/browserClient'
import { Button } from 'components/atoms/Button'
import { TextInput } from 'components/atoms/TextInput'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = browserClient()

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      // Redirect to admin
      router.push('/admin')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <TextInput
          name="email"
          label="Email address"
          type="email"
          required
          value={email}
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
          variant="secondary"
        />

        <TextInput
          name="password"
          label="Password"
          type="password"
          required
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          variant="secondary"
        />
      </div>

      <Button label={loading ? 'Signing in...' : 'Sign in'} type="submit" disabled={loading} />

      {error && <p className="text-sm text-red-800">{error}</p>}
    </form>
  )
}
