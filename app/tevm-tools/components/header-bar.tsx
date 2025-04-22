'use client'

import { Button } from '@/components/ui/button'
import { Moon, Pause, Play, Search, Settings, Square, StepForward, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

interface HeaderBarProps {
	onclick: () => void
	onToggleInspector: () => void
}

export function HeaderBar({ onclick, onToggleInspector }: HeaderBarProps) {
	const { theme, setTheme } = useTheme()

	return (
		<header className="h-12 flex items-center px-4 border-b border-highlight-line bg-bg-panel">
			<div className="flex items-center gap-2 mr-4">
				<span className="font-semibold text-lg">Tevm Tools</span>
			</div>

			<div className="flex items-center gap-2">
				<Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-highlight-line focus-visible" aria-label="Run">
					<Play className="h-4 w-4" />
				</Button>

				<Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-highlight-line focus-visible" aria-label="Step">
					<StepForward className="h-4 w-4" />
				</Button>

				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7 hover:bg-highlight-line focus-visible"
					aria-label="Pause"
				>
					<Pause className="h-4 w-4" />
				</Button>

				<Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-highlight-line focus-visible" aria-label="Stop">
					<Square className="h-4 w-4" />
				</Button>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7 hover:bg-highlight-line focus-visible animate-spring"
					aria-label="Search"
					onClick={onclick}
				>
					<Search className="h-4 w-4" />
				</Button>

				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7 hover:bg-highlight-line focus-visible"
					aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				>
					{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
				</Button>

				<Button
					size="icon"
					variant="ghost"
					className="h-7 w-7 hover:bg-highlight-line focus-visible"
					aria-label="Settings"
					onClick={onToggleInspector}
				>
					<Settings className="h-4 w-4" />
				</Button>
			</div>
		</header>
	)
}
