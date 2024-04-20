import { defaultWalletConnect } from './constants/defaults.js'
import { frameworks, packageManagers, useCases } from './constants/index.js'
import { getUserPkgManager } from './utils/getUserPkgManager.js'
import { z } from 'zod'

export const options = z
	.object({
		skipPrompts: z
			.boolean()
			.default(false)
			.describe(
				'Bypass interactive CLI prompt and use only command line flag options',
			),
		walletConnectProjectId: z
			.string()
			.default(defaultWalletConnect)
			.describe('Wallet connect project id'),
		packageManager: z
			.enum([
				packageManagers.choices.pnpm.value,
				packageManagers.choices.npm.value,
				packageManagers.choices.bun.value,
				packageManagers.choices.yarn.value,
			])
			.default(getUserPkgManager())
			.describe('JS package manager to use'),
		//  contractStrategy: z
		//    .enum([contractStrategy.choices.local.value, contractStrategy.choices.external.value, contractStrategy.choices.both.value])
		//    .default(contractStrategy.choices.local.value)
		//    .describe('Strategy for managing contracts'),
		useCase: z
			.enum([
				useCases.choices.simple.value,
				useCases.choices.ui.value,
				useCases.choices.server.value,
				// useCases.choices.scripting.value
			])
			.default(useCases.choices.ui.value)
			.describe('Use case for app'),
		framework: z
			.enum([
				frameworks.choices.simple.value,
				frameworks.choices.mud.value,
				frameworks.choices.server.value,
				frameworks.choices.pwa.value,
				frameworks.choices.next.value,
				frameworks.choices.remix.value,
				//    frameworks.choices.astro.value,
				//    frameworks.choices.svelte.value,
				//    frameworks.choices.vue.value,
				frameworks.choices.bun.value,
				//    frameworks.choices.elysia.value
			])
			.default(frameworks.choices.mud.value)
			.describe('Framework to use'),
		//  linter: z
		//    .enum([linters.choices['eslint-prettier'].value, linters.choices.biome.value, linters.choices.none.value])
		//    .default(linters.choices.biome.value)
		//    .describe('Linter to use'),
		//  testFrameworks: z
		//    .enum([testFrameworks.choices.vitest.value, testFrameworks.choices.none.value])
		//    .default(testFrameworks.choices.vitest.value),
		//  solidityFramework: z
		//    .enum([solidityFrameworks.choices.foundry.value, solidityFrameworks.choices.hardhat.value, solidityFrameworks.choices.none.value])
		//    .default(solidityFrameworks.choices.hardhat.value),
		//  typescriptStrictness: z
		//    .enum([typescriptStrictness.choices.strictist.value, typescriptStrictness.choices.strict.value, typescriptStrictness.choices.loose.value])
		//    .default(typescriptStrictness.choices.strictist.value),
		noGit: z
			.boolean()
			.default(false)
			.describe('Skips initializing a new git repo in the project'),
		noInstall: z
			.boolean()
			.default(false)
			.describe("Skips running the package manager's install command"),
		//  ciChoice: z
		//    .enum([ciChoices.choices.githubActions.value, ciChoices.choices.none.value])
		//    .default(ciChoices.choices.none.value)
		//    .describe('CI choice'),
	})
	.describe('Options for the create-evmts-app command')
