'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ConsolePaneProps {
	logs: {
		level: string
		message: string
	}[]
}

export function ConsolePane({ logs }: ConsolePaneProps) {
	const [activeTab, setActiveTab] = useState('all')

	const filteredLogs = logs.filter((log) => {
		if (activeTab === 'all') return true
		return log.level === activeTab
	})

	const getLogClass = (level: string) => {
		switch (level) {
			case 'error':
				return 'text-warn'
			case 'warn':
				return 'text-yellow-400'
			case 'event':
				return 'text-green-400'
			default:
				return 'text-text-primary'
		}
	}

	return (
		<div className="h-full flex flex-col bg-bg-panel">
			<div className="border-b border-highlight-line flex items-center justify-between px-2">
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="info">Info</TabsTrigger>
						<TabsTrigger value="warn">Warn</TabsTrigger>
						<TabsTrigger value="error">Error</TabsTrigger>
						<TabsTrigger value="event">Events</TabsTrigger>
					</TabsList>
				</Tabs>

				<Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Clear console">
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex-1 overflow-auto p-2">
				{filteredLogs.map((log, i) => (
					<div key={i} className={`py-1 font-mono text-sm animate-slide-up ${getLogClass(log.level)}`}>
						<span className="text-text-secondary mr-2">[{log.level}]</span>
						{log.message}
					</div>
				))}
			</div>
		</div>
	)
}
