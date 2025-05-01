'use client'

import type React from 'react'

import { ConsolePane } from '@/components/console-pane'
import { EditorPane } from '@/components/editor-pane'
import { useRef, useState } from 'react'

interface MainAreaProps {
	file: {
		name: string
		content: string
	}
	logs: {
		level: string
		message: string
	}[]
	sidebarWidth: number
	inspectorWidth: number
}

export function MainArea({ file, logs, sidebarWidth, inspectorWidth }: MainAreaProps) {
	const [editorHeight, setEditorHeight] = useState<number>(70) // percentage
	const [resizing, setResizing] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const handleResizeStart = (e: React.MouseEvent) => {
		e.preventDefault()
		setResizing(true)

		const startY = e.clientY
		const containerHeight = containerRef.current?.clientHeight || 0
		const startHeight = editorHeight

		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return

			const deltaY = e.clientY - startY
			const deltaPercent = (deltaY / containerHeight) * 100
			const newHeight = Math.max(30, Math.min(90, startHeight + deltaPercent))
			setEditorHeight(newHeight)
		}

		const handleMouseUp = () => {
			setResizing(false)
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	return (
		<div
			ref={containerRef}
			className="flex-1 flex flex-col overflow-hidden"
			style={{
				marginLeft: `${sidebarWidth}px`,
				marginRight: `${inspectorWidth}px`,
			}}
		>
			<div className="flex-1 overflow-hidden" style={{ height: `${editorHeight}%` }}>
				<EditorPane file={file} />
			</div>

			<div
				className="h-2 bg-bg-main hover:bg-highlight-line cursor-row-resize flex items-center justify-center"
				onMouseDown={handleResizeStart}
				role="separator"
				aria-orientation="horizontal"
				aria-label="Resize editor and console"
			>
				<div className="w-8 h-1 bg-highlight-line rounded-full" />
			</div>

			<div className="overflow-hidden" style={{ height: `${100 - editorHeight}%` }}>
				<ConsolePane logs={logs} />
			</div>
		</div>
	)
}
