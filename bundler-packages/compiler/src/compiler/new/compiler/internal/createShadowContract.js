import path from 'node:path'

/**
 * Wrap shadow code into a temporary contract that inherits from the target contract and returns the path to the shadow contract
 *
 * Note: we use this wrapper to compile the AST, which we then manipulate to correctly inject the shadow
 * code into the target contract
 * @param {string} shadowBody - The body of the shadow code
 * @param {string} sourceContractPath - The path to the target contract
 * @param {string} sourceContractName - The name of the target contract
 * @returns {{ [shadowContractPath: string]: string }} The wrapped shadow code and the path to the shadow contract
 */
export const createShadowContract = (shadowBody, sourceContractPath, sourceContractName) => {
	const sourceDirectory = path.dirname(sourceContractPath)
	const extension = path.extname(sourceContractPath)
	const sourceContractFileName = path.basename(sourceContractPath, extension)

	// source ERC20.sol -> __TevmShadow_ERC20__.sol
	const shadowContractName = `__TevmShadow_${sourceContractName}__`
	const shadowContractPath = path.join(sourceDirectory, `${shadowContractName}${extension}`)

	return {
		[shadowContractPath]: `
// GENERATED: Shadow contract for generating AST
import { ${sourceContractName} } from "./${sourceContractFileName}${extension}";

contract ${shadowContractName} is ${sourceContractName} {
  ${shadowBody}
}
`,
	}
}
