'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import { useEffect } from 'react'

import { useStylesStore } from '@/lib/store/use-styles'

/**
 * @notice This component is used to switch the theme based on the selected layout segment
 * @returns null
 * @see https://github.com/shadcn-ui/ui/blob/1f0a7008d6194e2c45b4ec250683e155f34be13f/apps/www/components/theme-switcher.tsx
 */
export const ThemeSwitcher = () => {
	const storedTheme = useStylesStore((state) => state.theme)
	const segment = useSelectedLayoutSegment()

	useEffect(() => {
		document.body.classList.forEach((className) => {
			if (className.match(/^theme.*/)) {
				document.body.classList.remove(className)
			}
		})

		const theme = segment === 'themes' ? storedTheme : null
		if (theme) {
			return document.body.classList.add(`theme-${theme}`)
		}
	}, [segment, storedTheme])

	return null
}
