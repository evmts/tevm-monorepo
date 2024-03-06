import { useEffect, useState } from 'react';

/**
 * @notice Hook to use media query (size of the screen)
 * @param query - media query string (e.g. '(min-width: 640px)')
 * @returns boolean - true if the media query matches, false otherwise
 * @see https://github.com/shadcn-ui/ui/blob/main/apps/www/hooks/use-media-query.tsx
 */
const useMediaQuery = (query: string) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
};

export { useMediaQuery };
