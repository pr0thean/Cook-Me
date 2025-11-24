'use client'

import { useState, useSyncExternalStore } from 'react'
import { tourSteps } from './steps'
import { useWindowSize } from 'usehooks-ts'
import JoyRide, { CallBackProps } from 'react-joyride-react19-compat'
import { guidedTourStyles } from './styles'

const emptySubscribe = () => () => {}

export const GuidedTour = () => {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const shouldRunTour = useSyncExternalStore(
    emptySubscribe,
    () => !localStorage.getItem('tour-completed'),
    () => false
  )
  const [dismissed, setDismissed] = useState(false)

  const { width } = useWindowSize()
  const isDesktop = width > 768

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data

    if (status === 'finished' || status === 'skipped') {
      localStorage.setItem('tour-completed', 'true')
      setDismissed(true)
    }
  }

  const customLocale = {
    last: 'End tour',
    next: 'Next',
    skip: 'Skip',
    back: 'Back',
  }

  if (!isClient) {
    return null
  }

  const run = shouldRunTour && !dismissed

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
