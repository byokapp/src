import { useMediaQuery, useTheme } from '@mui/material';

export const breakpoint = 'md';
export const isSmallScreen = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down(breakpoint));

  return fullScreen;
};
export const responsiveChartsWidth = () => (isSmallScreen() ? '400px' : '1140px');
export const responsiveTableWidth = () => (isSmallScreen() ? 400 : 900);
