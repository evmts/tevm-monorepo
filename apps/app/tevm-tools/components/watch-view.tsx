'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface WatchViewProps {
	watches: {
		expression: string
		value: string
	}[]
}

export function WatchView({ watches: initialWatches }: WatchViewProps) {
	const [watches, setWatches] = useState(initialWatches)
	const [newExpression, setNewExpression] = useState('')

	const addWatch = () => {
		if (!newExpression.trim()) return

		setWatches([...watches, { expression: newExpression, value: '...' }])
		setNewExpression('')
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			addWatch()
		}
	}

	return (
		<div className="p-4">
			<div className="font-medium mb-2">Watch Expressions</div>

			<div className="flex mb-4">
				<Input
					value={newExpression}
					onChange={(e) => setNewExpression(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Add expression..."
					className="mr-2"
				/>
				<Button size="sm" onClick={addWatch}>
					<Plus className="h-4 w-4 mr-1" />
					Add
				</Button>
			</div>

			<div className="space-y-1">
				{watches.map((watch, i) => (
					<div key={i} className="flex items-start py-1 border-b border-highlight-line">
						<div className="w-1/2 font-mono">{watch.expression}</div>
						<div className="w-1/2 font-mono text-text-secondary">{watch.value}</div>
					</div>
				))}
			</div>
		</div>
	)
}
