import fs from 'node:fs'
import path from 'node:path'
import type { EIP1193Parameters, EIP1474Methods } from 'viem'
import { assert } from 'vitest'

export const assertMethodCached = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
	withParams?: (params: Extract<EIP1193Parameters<EIP1474Methods>, { method: TMethod }>['params']) => boolean,
) => {
	const entries = getHarLogEntries()
	const cached = entries.some(
		(e) =>
			JSON.parse(e.request.postData?.text ?? '').method === method &&
			(withParams ? withParams(JSON.parse(e.request.postData?.text ?? '').params) : true),
	)
	assert(cached, `${method} should be cached`)
}

export const assertMethodNotCached = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
	withParams?: (params: Extract<EIP1193Parameters<EIP1474Methods>, { method: TMethod }>['params']) => boolean,
) => {
	const entries = getHarLogEntries()
	const cached = entries.some(
		(e) =>
			JSON.parse(e.request.postData?.text ?? '').method === method &&
			(withParams ? withParams(JSON.parse(e.request.postData?.text ?? '').params) : true),
	)
	assert(!cached, `${method} should NOT be cached`)
}

type HarLogEntry = {
	request: {
		url: string
		postData?: {
			text: string
		}
	}
	response: {
		content: {
			text: string
		}
	}
}

export const getHarLogEntries = (): HarLogEntry[] => {
	const harFiles = findRecordingHarFiles()
	const harFilePath = harFiles[0]
	if (!harFilePath) {
		console.log('No recording.har file found')
		return []
	}

	const harContent = fs.readFileSync(harFilePath, 'utf-8')
	const harData = JSON.parse(harContent)
	return harData.log.entries as HarLogEntry[]
}

const findRecordingHarFiles = (dir?: string): string[] => {
	if (!dir) {
		// @ts-expect-error - accessing Vitest internals
		const vitestFilePath = globalThis.__vitest_worker__?.filepath
		if (!vitestFilePath) throw new Error('Could not find test file name from vitest worker')

		const testFileName = path.basename(vitestFilePath)
		dir = path.join(process.cwd(), '__snapshots__', testFileName)
	}

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
