import { z } from 'zod'
import { frameworks, linters, packageManagers, solidityFrameworks, testFrameworks, useCases } from './constants/index.js'
import { getUserPkgManager } from '../../utils/getUserPkgManager.js'

export const options = z.object({
  default: z
    .boolean()
    .default(false)
    .describe('Bypass CLI and use all default options'),
  packageManager: z
    .enum([packageManagers.pnpm.value, packageManagers.npm.value, packageManagers.bun.value, packageManagers.yarn.value])
    .default(getUserPkgManager())
    .describe('JS package manager to use'),
  useCase: z
    .enum([useCases.simple.value, useCases.ui.value, useCases.server.value, useCases.scripting.value])
    .default(useCases.ui.value)
    .describe('Use case for app'),
  framework: z
    .enum([frameworks.simple.value, frameworks.mud.value, frameworks.server.value, frameworks.pwa.value, frameworks.next.value, frameworks.remix.value, frameworks.astro.value, frameworks.svelte.value, frameworks.vue.value, frameworks.bun.value, frameworks.elysia.value, frameworks.htmx.value])
    .default(frameworks.mud.value)
    .describe('Framework to use'),
  linter: z
    .enum([linters.eslintPrettier.value, linters.biome.value, linters.none.value])
    .default(linters.biome.value)
    .describe('Linter to use'),
  testFrameworks: z
    .enum([testFrameworks.vitest.value, testFrameworks.none.value])
    .default(testFrameworks.vitest.value),
  solidityFramework: z
    .enum([solidityFrameworks.foundry.value, solidityFrameworks.hardhat.value, solidityFrameworks.evmts.value])
    .default(solidityFrameworks.hardhat.value),
  noGit: z
    .boolean()
    .default(false)
    .describe('Skips initializing a new git repo in the project'),
  noInstall: z
    .boolean()
    .default(false)
    .describe("Skips running the package manager's install command"),
}).describe("Options for the create-evmts-app command")

