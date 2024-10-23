'use client'

import Image from 'next/image'
import { Step } from 'react-joyride'

const stepOneContent = (isDesktop: boolean) => (
  <div>
    <Image
      src="/assets/images/tour-bear-transparent.png"
      alt="welcome-to-cook-me"
      width={isDesktop ? 250 : 150}
      height={isDesktop ? 250 : 150}
    />
    <h1 className="mb-[6px] mt-5 font-bold md:mt-9 md:text-xl">
      Welcome to <span className="text-orange">Cook Me</span>!
    </h1>
    <div className="text-xs md:text-base">
      Before I let you run wild on your own, I would like to introduce you to a few highlights in
      Cook Me. Are you up for it?
    </div>
  </div>
)

export const tourSteps = (isDesktop: boolean): Step[] => [
  {
    content: stepOneContent(isDesktop),
    placement: 'center',
    target: 'body',
    disableBeacon: true,
    locale: {
      next: 'Show me around',
      skip: 'Maybe later',
    },
    styles: {
      tooltip: {
        backgroundColor: 'hsl(var(--color-white))',
        color: 'hsl(var(--color-black))',
      },
      buttonNext: {
        backgroundColor: 'hsl(var(--color-black))',
        color: 'hsl(var(--color-white))',
      },
      tooltipFooter: {
        flexDirection: 'row-reverse',
      },
    },
  },
  {
    target: '#tour-categories',
    title: 'Categories',
    content: "Browse recipes by category. Find what you're looking for with just a few clicks.",
    placementBeacon: 'top',
  },
  {
    target: '#tour-search',
    title: 'Search',
    content: (
      <div>
        The search bar is like a culinary detective. Type in the dish name, and it&apos;ll sniff it
        out faster than you can say <i>Where&apos;s the garlic?</i>
      </div>
    ),
  },
  {
    target: '#tour-navigation',
    title: 'Navigation',
    content: (
      <div>
        <div className="mb-1">Easily navigate to different sections of the app:</div>
        <div>
          <strong>Home</strong>: Return to the main page.
        </div>
        <div>
          <strong>Recipes</strong>: View all available recipes.
        </div>
        <div>
          <strong>About</strong>: Learn more about Cook Me.
        </div>
      </div>
    ),
  },
  {
    target: '#tour-restart',
    title: 'Restart Tour',
    content: 'Missed a step? No worries! Click here anytime to restart the tour.',
  },
]
