import { evmtsContractFactory } from '../evmtsContractFactory'
import { dummyAbi } from '../test/fixtures'
import type { Address } from 'abitype'
import { describe, expect, it } from 'vitest'

const dummyAddresses = { 1: '0x12345678' } as const satisfies Record<
	number,
	Address
>

const bytecode = '0x12345678'

const contract = evmtsContractFactory({
	abi: dummyAbi,
	name: 'DummyContract',
	addresses: dummyAddresses,
	bytecode,
})
describe('events', () => {
	it('should generate event filter parameters', () => {
		const eventFilterParams = contract.events().exampleEvent({
			fromBlock: 'latest',
			toBlock: 'latest',
			args: {},
			strict: false,
		})
		expect(eventFilterParams.eventName).toMatchInlineSnapshot('"exampleEvent"')
		expect(eventFilterParams.event).toMatchInlineSnapshot('undefined')
		expect(eventFilterParams.address).toMatchInlineSnapshot('"0x12345678"')
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
})
