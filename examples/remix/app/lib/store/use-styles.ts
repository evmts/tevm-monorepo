import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Config = {
  style: 'new-york';
  theme: 'neutral';
  radius: number;
};

/**
 * @notice Creates a store for shadcn/ui configuration
 * @returns a persistent store with the configuration state and methods to update it.
 * @see https://github.com/shadcn-ui/ui/blob/main/apps/www/hooks/use-config.ts
 * modified from jotai to zustand
 */
export const useStylesStore = create(
  persist<Config>(
    () => ({
      style: 'new-york',
      theme: 'neutral',
      radius: 0.5,
    }),
    {
      name: 'shadcn-styles',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);