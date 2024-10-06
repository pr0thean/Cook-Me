'use client'

import { useEffect, useState } from 'react'
import { tourSteps } from './steps'
import { useWindowSize } from 'usehooks-ts'
import JoyRide, { CallBackProps } from 'react-joyride'
import { guidedTourStyles } from './styles'

const GuidedTour = () => {
  const [run, setRun] = useState(false)
  const { width } = useWindowSize()

  const isDesktop = width > 768

  useEffect(() => {
    const isTourCompleted = localStorage.getItem('tour-completed')

    if (!isTourCompleted) {
      setRun(true)
    }
  }, [])

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data

    if (status === 'finished') {
      localStorage.setItem('tour-completed', 'true')
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

export default GuidedTour
