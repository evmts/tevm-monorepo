import { getArtifactPathSync } from '../utils/getArtifactPathSync'
import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import path from 'path'

const files = glob.sync([path.join(process.cwd(), '**/*.sol')])

files.forEach((file) => {
  const fileName = file.split('/').at(-1) as string
  const fileDir = file.split('/').slice(0, -1).join('/')

  const artifactPaths = getArtifactPathSync(
    fileName,
    process.cwd(),
    {
      name: '@evmts/ts-plugin',
      out: 'artifacts',
      project: '.',
    },
    console,
  )

  const dtsContent = artifactPaths
    .flatMap((artifactPath) => {
      const contractName = artifactPath.split('/').at(-1)?.replace('.json', '')
      const contractJson = readFileSync(artifactPath, 'utf-8')
      return [
        `const _${contractName} = ${contractJson} as const`,
        `export declare const ${contractName}: typeof _${contractName}`,
      ]
    })
    .join('\n')

  const dtsPath = path.join(fileDir, `${fileName}.d.ts`)

  writeFileSync(dtsPath, dtsContent)
})
