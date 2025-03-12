import { describe, expect, it } from 'vitest'
import * as stateExports from './index.js'

describe('index exports', () => {
	it('should export all required functions and classes', () => {
		// Classes
		expect(stateExports.ContractCache).toBeDefined()
		expect(stateExports.AccountCache).toBeDefined()
		expect(stateExports.StorageCache).toBeDefined()

		// Creator functions
		expect(stateExports.createStateManager).toBeDefined()
		expect(stateExports.createBaseState).toBeDefined()

		// Enum
		expect(stateExports.CacheType).toBeDefined()

		// Action functions
		expect(stateExports.commit).toBeDefined()
		expect(stateExports.revert).toBeDefined()
		expect(stateExports.deepCopy).toBeDefined()
		expect(stateExports.getProof).toBeDefined()
		expect(stateExports.checkpoint).toBeDefined()
		expect(stateExports.getAccount).toBeDefined()
		expect(stateExports.putAccount).toBeDefined()
		expect(stateExports.clearCaches).toBeDefined()
		expect(stateExports.dumpStorage).toBeDefined()
		expect(stateExports.shallowCopy).toBeDefined()
		expect(stateExports.getStateRoot).toBeDefined()
		expect(stateExports.hasStateRoot).toBeDefined()
		expect(stateExports.setStateRoot).toBeDefined()
		expect(stateExports.deleteAccount).toBeDefined()
		expect(stateExports.getForkClient).toBeDefined()
		expect(stateExports.getAppliedKey).toBeDefined()
		expect(stateExports.getContractCode).toBeDefined()
		expect(stateExports.getForkBlockTag).toBeDefined()
		expect(stateExports.putContractCode).toBeDefined()
		expect(stateExports.dumpStorageRange).toBeDefined()
		expect(stateExports.getContractStorage).toBeDefined()
		expect(stateExports.putContractStorage).toBeDefined()
		expect(stateExports.getAccountAddresses).toBeDefined()
		expect(stateExports.modifyAccountFields).toBeDefined()
		expect(stateExports.clearContractStorage).toBeDefined()
		expect(stateExports.dumpCanonicalGenesis).toBeDefined()
		expect(stateExports.getAccountFromProvider).toBeDefined()
		expect(stateExports.generateCanonicalGenesis).toBeDefined()
		expect(stateExports.originalStorageCache).toBeDefined()
	})
})
