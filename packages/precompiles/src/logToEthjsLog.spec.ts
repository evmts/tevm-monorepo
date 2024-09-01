import { SimpleContract } from '@tevm/contract'
import { type AbiEvent, encodeAbiParameters, encodeEventTopics, hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { logToEthjsLog } from './logToEthjsLog.js'

describe('logToEthjsLog', () => {
	const abi = SimpleContract.abi

	it('should correctly convert log arguments to ethjs log format', () => {
		const log = {
			eventName: 'ValueSet',
			args: {
				newValue: 100n,
			},
			address: '0x0000000000000000000000000000000000000002',
		} as const
		const result = logToEthjsLog(abi, log)

		const topics = encodeEventTopics({
			abi,
			eventName: log.eventName,
			args: log.args,
		}).map((topic) => hexToBytes(topic as `0x${string}`))
		const eventItem = abi.find((item) => item.type === 'event' && item.name === log.eventName)
		const data = encodeAbiParameters(eventItem?.inputs as any, Object.values(log.args))

		expect(result).toEqual([hexToBytes(log.address), topics, hexToBytes(data)])
	})

	it('should throw an error if event is not found in ABI', () => {
		const log = {
			eventName: 'NonExistentEvent',
			args: {},
			address: '0x0000000000000000000000000000000000000002',
		} as const

		expect(() => logToEthjsLog(abi, log as any)).toThrowErrorMatchingInlineSnapshot(
			`
			[AbiEventNotFoundError: Event "NonExistentEvent" not found on ABI.
			Make sure you are using the correct ABI and that the event exists on it.

			Docs: https://viem.sh/docs/contract/encodeEventTopics
			Version: 2.21.1]
		`,
		)
	})

	it('should handle empty args', () => {
		const log = {
			eventName: 'ValueSet',
			args: {},
			address: '0x0000000000000000000000000000000000000002',
		} as const
		const abi = [
			{
				name: 'ValueSet',
				type: 'event',
				inputs: [],
			},
		] as [AbiEvent]
		const result = logToEthjsLog(abi, log)

		const topics = encodeEventTopics({
			abi: abi,
			eventName: log.eventName,
			args: log.args,
		}).map((topic) => hexToBytes(topic as `0x${string}`))
		const eventItem = abi.find((item) => item.type === 'event' && item.name === log.eventName)
		if (!eventItem) throw new Error('Event not found in ABI')
		const data = encodeAbiParameters(eventItem.inputs, [] as any)

		expect(result).toEqual([hexToBytes(log.address), topics, hexToBytes(data)])
	})
})
