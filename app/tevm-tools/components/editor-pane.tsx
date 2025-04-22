'use client'

import { Circle } from 'lucide-react'
import { useState } from 'react'

interface EditorPaneProps {
	file: {
		name: string
		content: string
	}
}

export function EditorPane({ file }: EditorPaneProps) {
	const [breakpoints, setBreakpoints] = useState<number[]>([])

	const toggleBreakpoint = (lineNumber: number) => {
		if (breakpoints.includes(lineNumber)) {
			setBreakpoints(breakpoints.filter((bp) => bp !== lineNumber))
		} else {
			setBreakpoints([...breakpoints, lineNumber])
		}
	}

	const lines = file.content.split('\n')

	return (
		<div className="h-full flex flex-col">
			<div className="border-b border-highlight-line px-4 py-2 bg-bg-panel">
				<span className="font-medium">{file.name}</span>
			</div>

			<div className="flex-1 overflow-auto relative">
				<pre className="code-editor p-0 m-0 relative">
					<div className="absolute top-0 left-0 w-12 h-full bg-bg-panel border-r border-highlight-line flex flex-col items-center">
						{lines.map((_, i) => (
							<div
								key={i}
								className="h-[1.3rem] w-full flex items-center justify-center cursor-pointer hover:bg-highlight-line"
								onClick={() => toggleBreakpoint(i + 1)}
							>
								{breakpoints.includes(i + 1) ? (
									<Circle
										className="h-3 w-3 fill-accent text-accent animate-spring"
										aria-label={`Remove breakpoint at line ${i + 1}`}
									/>
								) : null}
							</div>
						))}
					</div>

					<code className="block pl-16 pr-4">
						{lines.map((line, i) => (
							<div key={i} className={`h-[1.3rem] ${i === 24 ? 'bg-highlight-line' : ''}`}>
								<span className="text-text-secondary mr-4">{i + 1}</span>
								{line}
							</div>
						))}
					</code>
				</pre>
			</div>
		</div>
	)
}
