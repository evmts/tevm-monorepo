import { updatePragma } from './updatePragma.js'
import { flip, runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

describe(updatePragma.name, () => {
	it('should update the pragma of a solidity file', () => {
		const file = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Foo {}
`
		expect(runSync(updatePragma(file))).toMatchInlineSnapshot(`
      "
      // SPDX-License-Identifier: MIT
      pragma solidity >=0.8.0;

      contract Foo {}
      "
    `)
	})

	it('should error if no pragma is found', () => {
		const file = `
contract Foo {}
`
		expect(runSync(flip(updatePragma(file)))).toMatchInlineSnapshot(
			'[NoPragmaFoundError: No valid pragma statement found.]',
		)
	})

	const pragmaStyles = [
		'^0.8.0',
		'0.8.0',
		'>0.8.0',
		'>=0.8.0',
		'<0.8.0',
		'<=0.8.0',
		'~0.8.0',
	]

	it.each(pragmaStyles)(
		"should update the pragma of a solidity file with style '%s'",
		(style) => {
			const file = `
    // SPDX-License-Identifier: MIT
    pragma solidity ${style};

    contract Foo {}
    `

			const result = runSync(updatePragma(file))
			expect(result).includes('pragma solidity >=0.8.0;')
		},
	)
})
