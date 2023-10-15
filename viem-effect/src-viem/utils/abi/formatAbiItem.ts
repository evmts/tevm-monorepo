import type { AbiParameter } from 'abitype'

import {
  InvalidDefinitionTypeError,
  type InvalidDefinitionTypeErrorType,
} from '../../errors/abi.js'
import type { ErrorType } from '../../errors/utils.js'
import type { AbiItem } from '../../types/contract.js'

export type FormatAbiItemErrorType =
  | FormatAbiParamsErrorType
  | InvalidDefinitionTypeErrorType
  | ErrorType

export function formatAbiItem(
  abiItem: AbiItem,
  { includeName = false }: { includeName?: boolean } = {},
) {
  if (
    abiItem.type !== 'function' &&
    abiItem.type !== 'event' &&
    abiItem.type !== 'error'
  )
    throw new InvalidDefinitionTypeError(abiItem.type)

  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`
}

export type FormatAbiParamsErrorType = ErrorType

export function formatAbiParams(
  params: readonly AbiParameter[] | undefined,
  { includeName = false }: { includeName?: boolean } = {},
): string {
  if (!params) return ''
  return params
    .map((param) => formatAbiParam(param, { includeName }))
    .join(includeName ? ', ' : ',')
}

export type FormatAbiParamErrorType = ErrorType

function formatAbiParam(
  param: AbiParameter,
  { includeName }: { includeName: boolean },
): string {
  if (param.type.startsWith('tuple')) {
    return `(${formatAbiParams(
      (param as unknown as { components: AbiParameter[] }).components,
      { includeName },
    )})${param.type.slice('tuple'.length)}`
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : '')
}
