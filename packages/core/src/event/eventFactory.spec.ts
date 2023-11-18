import { evmtsContractFactory } from '../evmtsContractFactory'
import { dummyAbi } from '../test/fixtures'
import { eventsFactory } from './eventFactory'
import { formatAbi } from 'abitype'
import { describe, expect, it } from 'vitest'

const contract = evmtsContractFactory({
	humanReadableAbi: formatAbi(dummyAbi),
	name: 'DummyContract',
	bytecode: undefined,
	deployedBytecode: undefined,
})

const dummyAbiNoEvent = dummyAbi.filter((abi) => abi.type !== 'event')

const contractNoEvent = evmtsContractFactory({
	humanReadableAbi: formatAbi(dummyAbiNoEvent),
	name: 'DummyContract',
	bytecode: undefined,
	deployedBytecode: undefined,
})

describe(eventsFactory.name, () => {
	it('should generate event filter parameters', () => {
		const eventFilterParams = contract.events.exampleEvent({
			fromBlock: 'latest',
			toBlock: 'latest',
			args: {},
			strict: false,
		})
		expect(eventFilterParams.eventName).toMatchInlineSnapshot('"exampleEvent"')
		expect(eventFilterParams.event).toMatchInlineSnapshot('undefined')
		expect(eventFilterParams.args).toMatchInlineSnapshot('{}')
		expect(eventFilterParams.toBlock).toMatchInlineSnapshot('"latest"')
		expect(eventFilterParams.fromBlock).toMatchInlineSnapshot('"latest"')
		expect(eventFilterParams.strict).toMatchInlineSnapshot('false')
		expect(eventFilterParams.abi).toMatchInlineSnapshot(`
			[
			  {
			    "inputs": [
			      {
			        "name": "data",
			        "type": "string",
			      },
			    ],
			    "name": "exampleEvent",
			    "type": "event",
			  },
			]
		`)
	})

	it('should return an empty object when the provided abi includes no events', () => {
		expect(Object.keys(contractNoEvent.events)).toHaveLength(0)
	})

	it('should return an empty object when abi is an empty array', () => {
		const events = eventsFactory({ abi: [] })
		expect(Object.keys(events)).toHaveLength(0)
	})
})
