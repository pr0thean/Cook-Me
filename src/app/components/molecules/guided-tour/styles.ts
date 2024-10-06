import { Styles } from 'react-joyride'

const buttonBaseStyles = (isDesktop: boolean) => ({
  padding: isDesktop ? '8px 16px' : '6px 12px',
  borderRadius: '50px',
  fontSize: '12px',
  fontWeight: isDesktop ? '700' : '600',
  outlineColor: 'hsl(var(--color-black))',
})

export const guidedTourStyles = (isDesktop: boolean): Partial<Styles> => {
  return {
    tooltip: {
      padding: isDesktop ? '20px' : '10px',
      borderRadius: isDesktop ? '12px' : '6px',
      width: isDesktop ? 'unset' : 'fit-content',
      minWidth: '300px',
      maxWidth: isDesktop ? '500px' : '300px',
    },
    tooltipTitle: {
      fontSize: isDesktop ? '20px' : '16px',
      fontWeight: '700',
      textAlign: 'left',
      marginBottom: '6px',
    },
    tooltipContent: {
      padding: '0',
      textAlign: 'left',
      fontSize: isDesktop ? '16px' : '14px',
    },
    tooltipFooter: {
      gap: '10px',
      marginTop: '16px',
    },
    tooltipFooterSpacer: {
      flex: 'none',
    },
    buttonNext: {
      ...buttonBaseStyles(isDesktop),
      backgroundColor: 'hsl(var(--color-white))',
      color: 'hsl(var(--color-black))',
    },
    buttonBack: {
      ...buttonBaseStyles(isDesktop),
      marginRight: '0',
    },
    buttonSkip: {
      ...buttonBaseStyles(isDesktop),
    },
    beaconInner: {
      display: 'none',
    },
    beaconOuter: {
      border: '2px solid hsl(var(--color-orange))',
      backgroundColor: 'hsl(var(--color-orange))',
    },
    options: {
      arrowColor: 'hsl(var(--color-orange))',
      backgroundColor: 'hsl(var(--color-orange))',
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      primaryColor: 'hsl(var(--color-black))',
      textColor: 'hsl(var(--color-black))',
      beaconSize: 24,
      zIndex: 100,
    },
  }
}
