'use client';

import { useEffect } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';

import { useStylesStore } from '@/lib/store/use-styles';

/**
 * @notice This component is used to switch the theme based on the selected layout segment
 * @returns null
 */
export const ThemeSwitcher = () => {
  const storedTheme = useStylesStore((state) => state.theme);
  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    document.body.classList.forEach((className) => {
      if (className.match(/^theme.*/)) {
        document.body.classList.remove(className);
      }
    });

    const theme = segment === 'themes' ? storedTheme : null;
    if (theme) {
      return document.body.classList.add(`theme-${theme}`);
    }
  }, [segment, storedTheme]);

  return null;
};
