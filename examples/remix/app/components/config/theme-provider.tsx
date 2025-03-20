import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'
import * as React from 'react'

/**
 * @notice Theme provider for the application (dark/light mode).
 * @dev This wraps the entire application, along with the tooltip provider.
 */
export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
