'use client'

import { PercentBadgeIcon } from '@heroicons/react/24/outline'
import { Tip } from '@features/guided-tour/components/tip'
import { useState } from 'react'

const CheapTip = () => {
  const isTipCompleted = localStorage.getItem('tour-cheap-tip-completed')
  const [showTip, setShowTip] = useState(!isTipCompleted)

  const handleCloseTip = () => {
    localStorage.setItem('tour-cheap-tip-completed', 'true')
    setShowTip(false)
  }

  return (
    <div className="relative">
      <PercentBadgeIcon width={30} fill="hsl(var(--color-orange))" />

      {showTip && (
        <div className="absolute right-0 top-[-32px] whitespace-nowrap">
          <Tip text="Wallet friendly meal ahead!" onClose={handleCloseTip} />
        </div>
      )}
    </div>
  )
}

export default CheapTip
