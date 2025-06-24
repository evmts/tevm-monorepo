import fs from 'node:fs'
import path from 'node:path'
import { assert, expect } from 'vitest'

export const getHarLogEntries = () => {
	const harFilePath = findRecordingHarFiles()?.[0]
	assert(harFilePath, 'No recording.har file found')

	const harContent = fs.readFileSync(harFilePath, 'utf-8')
	const harData = JSON.parse(harContent)
	return harData.log.entries
}

const findRecordingHarFiles = (
	dir = path.join(process.cwd(), '__snapshots__', expect.getState().currentTestName ?? 'test'),
): string[] => {
	if (!fs.existsSync(dir)) return []
	const results: string[] = []
	const list = fs.readdirSync(dir, { withFileTypes: true })

	for (const file of list) {
		const fullPath = path.join(dir, file.name)
		if (file.isDirectory()) {
			results.push(...findRecordingHarFiles(fullPath))
		} else if (file.name === 'recording.har') {
			results.push(fullPath)
		}
	}

	return results
}
