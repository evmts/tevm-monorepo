import { /*NodePath, template,*/ types as t } from '@babel/core'
import { declare } from '@babel/helper-plugin-utils'
import * as babelParser from '@babel/parser'
import * as childProcess from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import * as nodePath from 'path'
import { z } from 'zod'

if (t) {
  // just hacking the linter into working while I"m not using this yet
}

/**
 * Parses whether a string is a propery solidity version e.g. 0.8.17
 */
const isSolidityVersion = (version: string) => {
  const regex = /^\d+\.\d+\.\d+$/
  return regex.test(version)
}

/**
 * Zod validator for babel-plugin-sol options
 */
export const optionsValidator = z.object({
  solc: z
    .string()
    .refine(isSolidityVersion)
    .optional()
    .default('0.8.17')
    .describe('solc version'),
  forgeExecutable: z
    .string()
    .optional()
    .default('forge')
    .describe('forge executable'),
})

/**
 * Expected shape of the forge artifacts
 */
export const forgeArtifactsValidator = z.object({
  abi: z.array(
    z.object({
      inputs: z.array(
        z.object({
          internalType: z.string(),
          name: z.string(),
          type: z.string(),
        }),
      ),
      name: z.string(),
      outputs: z.array(
        z.object({
          internalType: z.string(),
          name: z.string(),
          type: z.string(),
        }),
      ),
      stateMutability: z.string(),
      type: z.string(),
    }),
  ),
  bytecode: z.object({
    object: z.string(),
    sourceMap: z.string(),
  }),
})

/**
 * Options for babel-plugin-sol
 */
export type Options = z.infer<typeof optionsValidator>

/**
 * PLUGIN
 */
export default declare((api, options: Options) => {
  api.assertVersion(7)

  let id = 0

  /**
   * Get solc string
   */
  let solc: string
  let forgeExecutable: string
  try {
    solc = optionsValidator.parse(options).solc
    forgeExecutable = optionsValidator.parse(options).forgeExecutable
  } catch (e) {
    console.error(e)
    throw new Error('evmts babel plugin options are invalid')
  }

  /**
   * Create a forge project in temp dir
   */
  const tempDir = os.tmpdir()
  const tempForgeProjectPath = nodePath.join(
    tempDir,
    '__ts-sol-forge-project__',
  )
  const foundryTomlPath = nodePath.join(tempForgeProjectPath, 'foundry.toml')
  const foundryToml = `
[profile.project]
name = "temp-evmts-forge-project"
src = "src"
solc = "${solc}"
`
  if (fs.existsSync(tempForgeProjectPath)) {
    fs.rmdirSync(tempForgeProjectPath, { recursive: true })
  }
  fs.mkdirSync(tempForgeProjectPath)
  fs.writeFileSync(foundryTomlPath, foundryToml, { encoding: 'utf-8' })
  const srcPath = nodePath.join(tempForgeProjectPath, 'src')
  fs.mkdirSync(srcPath)

  return {
    name: 'evmts',
    visitor: {
      /**
       * @see https://babeljs.io/docs/en/babel-types
       */
      TaggedTemplateExpression: (path) => {
        const {
          node: { tag, quasi },
        } = path

        /**
         * Don't run plugin on template expressions that are not evmts
         */
        const isTsSolTag = tag.type === 'Identifier' && tag.name === 'evmts'
        if (!isTsSolTag) {
          return
        }

        /*
        we aren't handling string interpelation yet

        const strings: t.Node[] = []
        const raws = []
        for (const elem of quasi.quasis) {
          const { raw, cooked } = elem.value
          const value =
            cooked == null
              ? path.scope.buildUndefinedNode()
              : t.stringLiteral(cooked)

          strings.push(value)
          raws.push(t.stringLiteral(raw))
        }
        */

        /**
         * Write the solidity file to forge temp dir
         */
        const solidityString = `
        pragma solidity ^${solc};

        ${quasi.quasis[0]?.value.raw}
        `
        console.log(solidityString)
        if (!solidityString) {
          throw new Error('evmts tagged template literal must have a string')
        }
        const contractName = `TsSolScript_${id++}`
        const solidityFilePath = nodePath.join(srcPath, `${contractName}.sol`)
        fs.writeFileSync(solidityFilePath, solidityString, {
          encoding: 'utf-8',
        })

        console.log(childProcess.execSync(`cat ${foundryTomlPath}`).toString())

        /*
         * run forge build in project
         */
        childProcess.execSync(`${forgeExecutable} build`, {
          cwd: tempForgeProjectPath,
        })

        /**
         * Read the artifact
         */
        const artifactsPath = nodePath.join(
          tempForgeProjectPath,
          'out',
          `${contractName}.sol`,
          `Script.json`,
        )
        const { abi, bytecode } = forgeArtifactsValidator.parse(
          JSON.parse(
            fs.readFileSync(artifactsPath, {
              encoding: 'utf-8',
            }),
          ),
        )

        console.log({ abi, bytecode })

        path.replaceWith(artifactsToAst({ abi, bytecode }))
      },
    },
  }
})

const artifactsToAst = (artifacts: z.infer<typeof forgeArtifactsValidator>) => {
  return babelParser.parseExpression(JSON.stringify(artifacts))
}
