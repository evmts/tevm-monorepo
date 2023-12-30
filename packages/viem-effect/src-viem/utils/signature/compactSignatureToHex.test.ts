import { expect, test } from 'vitest'

import { compactSignatureToHex } from './compactSignatureToHex.js'

test('default', () => {
	expect(
		compactSignatureToHex({
			r: '0x68a020a209d3d56c46f38cc50a33f704f4a9a10a59377f8dd762ac66910e9b90',
			yParityAndS:
				'0x7e865ad05c4035ab5792787d4a0297a43617ae897930a6fe4d822b8faea52064',
		}),
	).toMatchInlineSnapshot(
		'"0x68a020a209d3d56c46f38cc50a33f704f4a9a10a59377f8dd762ac66910e9b907e865ad05c4035ab5792787d4a0297a43617ae897930a6fe4d822b8faea52064"',
	)

	expect(
		compactSignatureToHex({
			r: '0x9328da16089fcba9bececa81663203989f2df5fe1faa6291a45381c81bd17f76',
			yParityAndS:
				'0x939c6d6b623b42da56557e5e734a43dc83345ddfadec52cbe24d0cc64f550793',
		}),
	).toMatchInlineSnapshot(
		'"0x9328da16089fcba9bececa81663203989f2df5fe1faa6291a45381c81bd17f76939c6d6b623b42da56557e5e734a43dc83345ddfadec52cbe24d0cc64f550793"',
	)
})
