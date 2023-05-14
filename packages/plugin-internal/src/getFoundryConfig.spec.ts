import { execaCommandSync } from 'execa'
import path from 'pathe'
import { it, expect, describe, beforeEach, vi, Mock } from 'vitest'
import { getFoundryConfig } from './getFoundryConfig'

vi.mock('execa', () => ({
  execaCommandSync: vi.fn(),
}))

vi.mock('pathe', () => ({
  default: { join: vi.fn((a, b) => `${a}/${b}`) },
}))

describe('getFoundryConfig', () => {
  const defaultOptions = {
    forgeExecutable: 'forge',
    projectRoot: process.cwd(),
    deployments: {},
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns default config when execaCommandSync throws error', async () => {
    (execaCommandSync as any).mockImplementation(() => {
      throw new Error('Command error')
    })

    const config = getFoundryConfig(defaultOptions)

    expect(config).toEqual({
      src: 'src',
      out: `${process.cwd()}/out`,
    })
    expect(execaCommandSync).toHaveBeenCalledWith(
      `${defaultOptions.forgeExecutable} config --json --root ${defaultOptions.projectRoot}`,
    )
    expect(path.join).toHaveBeenCalledWith(
      defaultOptions.projectRoot,
      'out',
    )
  })

  it('returns parsed config when execaCommandSync executes successfully', async () => {
    (execaCommandSync as Mock).mockImplementation(() => ({
      stdout: JSON.stringify({ src: 'src2', out: 'out2' }),
    }))

    const config = getFoundryConfig(defaultOptions)

    expect(config).toEqual({
      src: 'src2',
      out: `${process.cwd()}/out2`,
    })
    expect(execaCommandSync).toHaveBeenCalledWith(
      `${defaultOptions.forgeExecutable} config --json --root ${defaultOptions.projectRoot}`,
    )
    expect(path.join).toHaveBeenCalledWith(
      defaultOptions.projectRoot,
      'out2',
    )
  })
})

