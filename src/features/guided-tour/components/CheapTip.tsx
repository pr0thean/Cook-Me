'use client'

import { PercentBadgeIcon } from '@heroicons/react/24/outline'
import { Tip } from './Tip'
import { useEffect, useState } from 'react'

export const CheapTip = () => {
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    const isTipCompleted = localStorage.getItem('tour-cheap-tip-completed')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowTip(!isTipCompleted)
  }, [])

  const handleCloseTip = () => {
    localStorage.setItem('tour-cheap-tip-completed', 'true')
    setShowTip(false)
  }

  return (
    <div className="relative">
      <PercentBadgeIcon width={30} fill="var(--color-orange)" />

      {showTip && (
        <div className="absolute -top-8 right-0 whitespace-nowrap">
          <Tip text="Wallet friendly meal ahead!" onClose={handleCloseTip} />
        </div>
      )}
    </div>
  )
}
