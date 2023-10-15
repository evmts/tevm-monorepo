import { expect, test } from 'vitest'

import { publicKeyToAddress } from './publicKeyToAddress.js'

test('default', () => {
  expect(
    publicKeyToAddress(
      '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5',
    ),
  ).toEqual('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
})
