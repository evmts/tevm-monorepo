import type { Artifacts } from '../solc/resolveArtifactsSync'
import type { Logger } from '../types'
import { generateEvmtsBody } from './generateEvmtsBody'

export const generateRuntimeSync = (
  artifacts: Artifacts,
  logger: Logger,
): string => {
  if (!artifacts || Object.keys(artifacts).length === 0) {
    logger.warn('No artifacts found, skipping runtime generation')
    return ''
  }
  const lines: string[] = []
  Object.entries(artifacts).forEach(([contractName, { abi, userdoc = {} }]) => {
    lines.push(`const _${contractName} = {`)
    abi.forEach((abiItem) => {
      if (abiItem.type === 'constructor') {
      } else if (abiItem.type === 'error') {
        abiItem.inputs
        abiItem.name
      } else if (abiItem.type === 'event') {
        abiItem.name
        abiItem.inputs
        abiItem.anonymous
      } else if (abiItem.type === 'receive') {
        abiItem.stateMutability === 'payable'
      } else if (abiItem.type === 'function') {
        abiItem.stateMutability === 'pure'
        abiItem.stateMutability === 'view'
        abiItem.stateMutability === 'payable'
        abiItem.stateMutability === 'nonpayable'
      } else if (abiItem.type === 'fallback') {
        abiItem.stateMutability === 'nonpayable'
        abiItem.stateMutability === 'payable'
      }
    })
    lines.push('}')
  })

  return lines.join('\n')
}
