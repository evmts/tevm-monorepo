import { flip, runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { updatePragma } from './updatePragma.js'

describe(updatePragma.name, () => {
	it('should validate and preserve the pragma of a solidity file', () => {
		const file = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Foo {}
`
		expect(runSync(updatePragma(file))).toMatchInlineSnapshot(`
			"
			// SPDX-License-Identifier: MIT
			pragma solidity ^0.8.0;

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
		'>=0.8.0 <0.8.9',
		' >=0.8.0  <0.8.9 ',
		'^0.8.0 ',
	]

	it.each(pragmaStyles)("should validate and preserve pragma style '%s'", (style) => {
		const file = `
    // SPDX-License-Identifier: MIT
    pragma solidity ${style};

    contract Foo {}
    `

		const result = runSync(updatePragma(file))
		expect(result).toBe(file)
	})

	it('should ignore legacy custom version override', () => {
		const file = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Foo {}
`
		const result = runSync(updatePragma(file, '0.8.20'))
		expect(result).toBe(file)
	})

	it('should ignore legacy custom version override with bounds pattern', () => {
		const file = `
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Foo {}
`
		const result = runSync(updatePragma(file, '0.8.20'))
		expect(result).toBe(file)
	})

	it('should preserve multiple pragma directives', () => {
		const file = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract Foo {}
`
		const result = runSync(updatePragma(file, '0.8.20'))
		expect(result).toBe(file)
	})

	it('should preserve comments before pragma', () => {
		const file = `
// SPDX-License-Identifier: MIT
// This is a comment
pragma solidity ^0.8.0;

contract Foo {}
`
		const result = runSync(updatePragma(file, '0.8.20'))
		expect(result).toBe(file)
	})

	it('should preserve pragma style', () => {
		const styles = {
			'^': 'pragma solidity ^0.8.0;',
			'': 'pragma solidity 0.8.0;',
			'>': 'pragma solidity >0.8.0;',
			'>=': 'pragma solidity >=0.8.0;',
			'<': 'pragma solidity <0.8.0;',
			'<=': 'pragma solidity <=0.8.0;',
			'~': 'pragma solidity ~0.8.0;',
		}

		for (const [_, pragma] of Object.entries(styles)) {
			const file = `
// SPDX-License-Identifier: MIT
${pragma}

contract Foo {}
`
			const customVersion = '0.8.20'
			const result = runSync(updatePragma(file, customVersion))

			expect(result).toBe(file)
		}
	})
})
