import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { Box, Text } from 'ink'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Creating } from '../components/Creating.js'
import { FancyCreateTitle } from '../components/FancyCreateTitle.js'
import { InteractivePrompt } from '../components/InteractivePrompt.js'
import type { State } from '../state/State.js'
import { useStore } from '../state/Store.js'
import { type args } from '../utils/create-args.js'
import { type options } from '../utils/create-options.js'

type Props = {
	options: z.infer<typeof options>
	args: z.infer<typeof args>
}

// Add command description for help output
export const description = 'Create a new Ethereum account or smart contract'

export default function Create({ options, args: [defaultName] }: Props) {
	const createdRef = useRef(false)

	// Initialize store with default values
	useEffect(() => {
		useStore.setState({
			name: defaultName,
			currentStep: 0,
			path: path.resolve(defaultName),
			nameInput: '',
			framework: options.template,
			useCase: 'ui',
			packageManager: 'npm',
			noGit: false,
			noInstall: false,
			currentPage: options.skipPrompts ? 'creating' : 'interactive',
			walletConnectProjectId: '',
		} satisfies State)
	}, [defaultName, options.skipPrompts, options.template])

	const store = useStore()

	useEffect(() => {
		if (store.currentPage !== 'creating' || createdRef.current) {
			return
		}

		createdRef.current = true

		const projectName = store.name || defaultName
		const packageName = projectName.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
		const projectPath = path.resolve(projectName)
		const srcPath = path.join(projectPath, 'src')
		const writeIfMissing = (filePath: string, content: string) => {
			if (!existsSync(filePath)) {
				writeFileSync(filePath, content)
			}
		}

		mkdirSync(srcPath, { recursive: true })
		writeIfMissing(
			path.join(projectPath, 'package.json'),
			`${JSON.stringify(
				{
					name: packageName,
					type: 'module',
					scripts: {
						build: 'tevm generate contract',
					},
					dependencies: {
						tevm: 'latest',
						viem: 'latest',
					},
					devDependencies: {
						'@tevm/ts-plugin': 'latest',
						typescript: 'latest',
					},
				},
				null,
				2,
			)}
`,
		)
		writeIfMissing(
			path.join(projectPath, 'tsconfig.json'),
			`{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "strict": true,
    "plugins": [{ "name": "@tevm/ts-plugin" }]
  },
  "include": ["src"]
}
`,
		)
		writeIfMissing(
			path.join(srcPath, 'Counter.sol'),
			`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
`,
		)
		writeIfMissing(
			path.join(projectPath, 'README.md'),
			`# ${projectName}

Generated with Tevm.
`,
		)

		if (store.framework === 'foundry') {
			writeIfMissing(
				path.join(projectPath, 'foundry.toml'),
				`[profile.default]
src = "src"
out = "out"
libs = ["lib"]
`,
			)
		}

		useStore.setState({ path: projectPath, currentPage: 'complete' })
	}, [defaultName, store.currentPage, store.framework, store.name])

	const pages = {
		interactive: <InteractivePrompt defaultName={defaultName} store={store} />,
		creating: <Creating store={store} />,
		complete: <Text>Created {store.path}</Text>,
	}

	return (
		<Box display="flex" flexDirection="column">
			<FancyCreateTitle key={store.currentPage} loading={store.currentPage === 'creating'} />
			{pages[store.currentPage]}
		</Box>
	)
}
