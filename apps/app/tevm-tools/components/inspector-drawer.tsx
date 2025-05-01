'use client'

import type React from 'react'

import { CallStackView } from '@/components/call-stack-view'
import { StorageView } from '@/components/storage-view'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VariablesView } from '@/components/variables-view'
import { WatchView } from '@/components/watch-view'
import { useState } from 'react'

interface InspectorDrawerProps {
	open: boolean
	width: number
	onResize: (width: number) => void
	variables: {
		name: string
		value: string
		type: string
	}[]
	storage: {
		slot: string
		key: string
		value: string
		diff: boolean
	}[]
	callStack: {
		name: string
		source: string
		line: number
	}[]
	watches: {
		expression: string
		value: string
	}[]
}

export function InspectorDrawer({
	open,
	width,
	onResize,
	variables,
	storage,
	callStack,
	watches,
}: InspectorDrawerProps) {
	const [resizing, setResizing] = useState(false)

	const handleResizeStart = (e: React.MouseEvent) => {
		e.preventDefault()
		setResizing(true)

		const startX = e.clientX
		const startWidth = width

		const handleMouseMove = (e: MouseEvent) => {
			const newWidth = Math.max(250, Math.min(500, startWidth - (e.clientX - startX)))
			onResize(newWidth)
		}

		const handleMouseUp = () => {
			setResizing(false)
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	if (!open) return null

	return (
		<div
			className="fixed top-12 right-0 bottom-0 bg-bg-panel border-l border-highlight-line z-10 animate-fade"
			style={{ width: `${width}px` }}
			role="complementary"
			aria-label="Inspector"
		>
			<div
				className="absolute top-0 left-0 w-2 h-full cursor-col-resize hover:bg-highlight-line"
				onMouseDown={handleResizeStart}
				role="separator"
				aria-orientation="vertical"
				aria-label="Resize inspector"
			/>

			<Tabs defaultValue="variables" className="h-full flex flex-col">
				<TabsList className="mx-4 my-2 justify-start">
					<TabsTrigger value="variables">Variables</TabsTrigger>
					<TabsTrigger value="storage">Storage</TabsTrigger>
					<TabsTrigger value="callstack">Call Stack</TabsTrigger>
					<TabsTrigger value="watch">Watch</TabsTrigger>
				</TabsList>

				<TabsContent value="variables" className="flex-1 overflow-auto p-0 m-0">
					<VariablesView variables={variables} />
				</TabsContent>

				<TabsContent value="storage" className="flex-1 overflow-auto p-0 m-0">
					<StorageView storage={storage} />
				</TabsContent>

				<TabsContent value="callstack" className="flex-1 overflow-auto p-0 m-0">
					<CallStackView callStack={callStack} />
				</TabsContent>

				<TabsContent value="watch" className="flex-1 overflow-auto p-0 m-0">
					<WatchView watches={watches} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
