import { evmtsContractFactory } from '../evmtsContractFactory'
import { dummyAbi } from '../test/fixtures'
import { eventsFactory } from './eventFactory'
import type { Address } from 'abitype'
import { describe, expect, it } from 'vitest'

const dummyAddresses = {
	1: '0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819',
} as const satisfies Record<number, Address>

const contract = evmtsContractFactory({
	abi: dummyAbi,
	name: 'DummyContract',
	addresses: dummyAddresses,
})

const dummyAbiNoEvent = dummyAbi.filter((abi) => abi.type !== 'event')

const contractNoEvent = evmtsContractFactory({
	abi: dummyAbiNoEvent,
	name: 'DummyContract',
	addresses: dummyAddresses,
})

describe(eventsFactory.name, () => {
	it('should generate event filter parameters', () => {
		const eventFilterParams = contract.events().exampleEvent({
			fromBlock: 'latest',
			toBlock: 'latest',
			args: {},
			strict: false,
		})
		expect(eventFilterParams.eventName).toMatchInlineSnapshot('"exampleEvent"')
		expect(eventFilterParams.event).toMatchInlineSnapshot('undefined')
		expect(eventFilterParams.address).toMatchInlineSnapshot(
			'"0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819"',
		)
		expect(eventFilterParams.args).toMatchInlineSnapshot('{}')
		expect(eventFilterParams.toBlock).toMatchInlineSnapshot('"latest"')
		expect(eventFilterParams.fromBlock).toMatchInlineSnapshot('"latest"')
		expect(eventFilterParams.strict).toMatchInlineSnapshot('false')
		expect(eventFilterParams.abi).toMatchInlineSnapshot(`
        [
          {
            "inputs": [
              {
                "indexed": false,
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

	it('should generate event filter parameters when chainId is not provided', () => {
		const event = contract.events().exampleEvent({ strict: false })

		expect(event.address).toEqual(Object.values(dummyAddresses)[0])
	})

	it('should generate event filter parameters when chainId is provided', () => {
		const event = contract
			.events({ chainId: 1 })
			.exampleEvent({ strict: false })

		expect(event.address).toEqual(dummyAddresses[1])
	})

	it('should return an empty object when the provided abi includes no events', () => {
		const eventCreator = contractNoEvent.events({ chainId: 1 })
		expect(Object.keys(eventCreator)).toHaveLength(0)
	})

	it('should return an empty object when abi is an empty array', () => {
		const events = eventsFactory({ abi: [], addresses: dummyAddresses })
		const eventCreator = events({ chainId: 1 })
		expect(Object.keys(eventCreator)).toHaveLength(0)
	})
})
