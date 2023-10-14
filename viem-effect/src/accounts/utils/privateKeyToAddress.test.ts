import { expect, test } from 'vitest'

import { privateKeyToAddress } from './privateKeyToAddress.js'
import { accounts } from '~test/src/constants.js'

test('default', () => {
	expect(privateKeyToAddress(accounts[0].privateKey).toLowerCase()).toEqual(
		accounts[0].address,
	)
})
