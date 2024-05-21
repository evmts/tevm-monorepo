import { bench, describe, expect } from 'vitest'
import { slowCallRepo } from './slowCallRepo.js'

describe('Call repo', async () => {
	bench('This call takes 5 seconds locally over 10 seconds when deployed according to a bug report', async () => {
		expect(await slowCallRepo()).toEqual({
			createdAddress: '0xF52CF539DcAc32507F348aa19eb5173EEA3D4e7c',
			createdAddresses: new Set(['0xF52CF539DcAc32507F348aa19eb5173EEA3D4e7c']),
			executionGasUsed: 62930n,
			gas: 16754885n,
			logs: [],
			rawData:
				'0x6080604052348015600f57600080fd5b506004361060325760003560e01c806301339c211460375780638c59507c14603f575b600080fd5b603d6059565b005b604760005481565b60405190815260200160405180910390f35b7f7c84ba1c5769a0155145414f13e03f1d0d6a3a7e5d4f6d45262df4d9d48c32cd600054604051608b91815260200190565b60405180910390a156fea26469706673582212201509e5f7aed59985fb32c8f48b792565644fc6decb12b235b12226ae2855c4f464736f6c634300080d0033',
			selfdestruct: new Set(),
		})
	})
})
