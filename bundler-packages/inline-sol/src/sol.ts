import { type Contract } from '@tevm/contract'
import { type Hex } from '@tevm/utils'

export function sol<TAbi extends ReadonlyArray<string> = ReadonlyArray<string>>(
strings: TemplateStringsArray,
): Contract<string, TAbi, undefined, Hex, Hex, undefined> {
if (!strings) {
throw new Error('The sol function must be called with a template string')
}
throw new Error(
'The TEVM compiler must be used to compile Solidity code. Please install a tevm bundler or use the tevm CLI.',
)
}
