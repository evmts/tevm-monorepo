import { createAddress } from '@tevm/address'
import { SimpleContract } from '@tevm/test-utils'
import { EthjsAccount } from '@tevm/utils'
import { hexToBytes, numberToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'
import { putAccount } from './putAccount.js'
import { putContractCode } from './putContractCode.js'
import { putContractStorage } from './putContractStorage.js'

describe(dumpCanonicalGenesis.name, () => {
	it('dumps state into primitive types', async () => {
		const state = createBaseState({})
		await putAccount(state)(
			createAddress(`0x${'69'.repeat(20)}`),
			EthjsAccount.fromAccountData({
				nonce: 2n,
				balance: 69n,
			}),
		)
		await putAccount(state)(
			createAddress(`0x${'4200'.repeat(10)}`),
			EthjsAccount.fromAccountData({
				nonce: 2n,
				balance: 69n,
			}),
		)
		await putContractCode(state)(createAddress(`0x${'4200'.repeat(10)}`), hexToBytes(SimpleContract.deployedBytecode))
		await putContractStorage(state)(
			createAddress(`0x${'4200'.repeat(10)}`),
			numberToBytes(0, { size: 32 }),
			numberToBytes(420),
		)
		expect(await dumpCanonicalGenesis(state)()).toMatchInlineSnapshot(`
			{
			  "0x4200420042004200420042004200420042004200": {
			    "balance": 69n,
			    "codeHash": "0xc832aa8616e87d0a857dd93588b32cacc51deb4920b7c784b52afcbc1f97bdc5",
			    "deployedBytecode": "0x608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100f1565b610072565b005b61005c6100b2565b604051610069919061012b565b60405180910390f35b805f819055507f012c78e2b84325878b1bd9d250d772cfe5bda7722d795f45036fa5e1e6e303fc816040516100a7919061012b565b60405180910390a150565b5f8054905090565b5f80fd5b5f819050919050565b6100d0816100be565b81146100da575f80fd5b50565b5f813590506100eb816100c7565b92915050565b5f60208284031215610106576101056100ba565b5b5f610113848285016100dd565b91505092915050565b610125816100be565b82525050565b5f60208201905061013e5f83018461011c565b9291505056fea2646970667358221220792d4ee4a770b6a319a0ec659b77ea24497824649e20dcdea1dd7acf6118a5fe64736f6c63430008160033",
			    "nonce": 2n,
			    "storage": {
			      "0000000000000000000000000000000000000000000000000000000000000000": "0x01a4",
			    },
			    "storageRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
			  },
			  "0x6969696969696969696969696969696969696969": {
			    "balance": 69n,
			    "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
			    "nonce": 2n,
			    "storage": {},
			    "storageRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
			  },
			}
		`)
	})
})
