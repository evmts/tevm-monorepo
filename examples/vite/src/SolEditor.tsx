import { useQuery } from '@tanstack/react-query'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-core'
import 'prismjs/themes/prism.css' //Example style, you can use another
import { useState } from 'react'
import Editor from 'react-simple-code-editor'
const solcCompile = () => {}
languages.solidity = languages.extend('clike', {
	'class-name': {
		pattern:
			/(\b(?:contract|enum|interface|library|new|struct|using)\s+)(?!\d)[\w$]+/,
		lookbehind: true,
	},
	keyword:
		/\b(?:_|anonymous|as|assembly|assert|break|calldata|case|constant|constructor|continue|contract|default|delete|do|else|emit|enum|event|external|for|from|function|if|import|indexed|inherited|interface|internal|is|let|library|mapping|memory|modifier|new|payable|pragma|private|public|pure|require|returns?|revert|selfdestruct|solidity|storage|struct|suicide|switch|this|throw|using|var|view|while)\b/,
	operator: /=>|->|:=|=:|\*\*|\+\+|--|\|\||&&|<<=?|>>=?|[-+*/%^&|<>!=]=?|[~?]/,
})

languages.insertBefore('solidity', 'keyword', {
	builtin:
		/\b(?:address|bool|byte|u?int(?:8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?|string|bytes(?:[1-9]|[12]\d|3[0-2])?)\b/,
})

languages.insertBefore('solidity', 'number', {
	version: {
		pattern: /([<>]=?|\^)\d+\.\d+\.\d+\b/,
		lookbehind: true,
		alias: 'number',
	},
})
export const SolEditor = () => {
	const [code, setCode] = useState(
		`// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

contract AddNumbers {
  // Function to add two numbers
  function add(uint256 a, uint256 b) public pure returns (uint256) {
    return a + b;
  }
}
`,
	)

	const {
		data: artifacts,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['artifacts', code],
		queryFn: () => {
			return solcCompile({
				language: 'Solidity',
				sources: {
					userContract: {
						content: code,
					},
				},
				settings: {
					outputSelection: {
						'*': {
							'*': [
								'abi',
								'userdoc',
								'evm.bytecode.object',
								'evm.deployedBytecode.object',
							],
						},
					},
				},
			})
		},
	})

	return (
		<div>
			<h3>Edit this solidity contract to see how Tevm works</h3>
			<Editor
				value={code}
				onValueChange={(code) => setCode(code)}
				highlight={(code) => highlight(code, languages.solidity, 'solidity')}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 12,
				}}
			/>
			<h3>Tevm compiler</h3>
			<p>
				The Tevm compiler will compile the above solidity contract into the
				following artifacts using{' '}
				<a href='https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/docs/modules/solc.md#solccompile'>
					import("@tevm/solc").solcCompile
				</a>{' '}
				which is just a typesafe wrapper around{' '}
				<a href='https://docs.soliditylang.org/en/latest/installing-solidity.html'>
					solc
				</a>
				. This is the low level compiler used by all tools including hardhat and
				foundry.
			</p>
			{artifacts || error ? (
				<Editor
					value={JSON.stringify(artifacts)}
					onValueChange={(code) => setCode(code ?? error?.message)}
					highlight={(code) =>
						highlight(code, languages.javascript, 'javascript')
					}
					contentEditable={false}
					padding={10}
					style={{
						fontFamily: '"Fira code", "Fira Mono", monospace',
						fontSize: 12,
					}}
				/>
			) : isLoading ? (
				<div>loading artifacts</div>
			) : (
				<></>
			)}
		</div>
	)
}
