'use client'

import { useState } from 'react'
import { tourSteps } from './steps'
import { useWindowSize } from 'usehooks-ts'
import JoyRide, { CallBackProps } from 'react-joyride-react19-compat'
import { guidedTourStyles } from './styles'

export const GuidedTour = () => {
  const [run, setRun] = useState(() => {
    if (typeof window === 'undefined') return false

    const isTourCompleted = localStorage.getItem('tour-completed')
    return !isTourCompleted
  })
  const { width } = useWindowSize()

  const isDesktop = width > 768

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data

    if (status === 'finished') {
      localStorage.setItem('tour-completed', 'true')
      setRun(false)
    }
  }

  const customLocale = {
    last: 'End tour',
    next: 'Next',
    skip: 'Skip',
    back: 'Back',
  }

  return (
    <JoyRide
      run={run}
      steps={tourSteps(isDesktop)}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      hideCloseButton={true}
      locale={customLocale}
      callback={handleTourCallback}
      styles={guidedTourStyles(isDesktop)}
    />
  )
}
