import { expect, test } from 'vitest'

import { testClient } from '~test/src/utils.js'

import { getAutomine } from './getAutomine.js'
import { setAutomine } from './setAutomine.js'

// TODO: Anvil sometimes stops interval mining when automining is programatically set.
test.skip('gets automine status', async () => {
  await setAutomine(testClient, true)
  expect(await getAutomine(testClient)).toEqual(true)
  await setAutomine(testClient, false)
  expect(await getAutomine(testClient)).toEqual(false)
})
