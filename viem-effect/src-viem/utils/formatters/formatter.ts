import type { ErrorType } from '../../errors/utils.js'
import type { Assign, Prettify } from '../../types/utils.js'

export type DefineFormatterErrorType = ErrorType

export function defineFormatter<TType extends string, TParameters, TReturnType>(
  type: TType,
  format: (_: TParameters) => TReturnType,
) {
  return <
    TOverrideParameters,
    TOverrideReturnType,
    TExclude extends (keyof TParameters)[] = [],
  >({
    exclude,
    format: overrides,
  }: {
    exclude?: TExclude
    format: (_: TOverrideParameters) => TOverrideReturnType
  }) => {
    return {
      exclude,
      format: (args: Assign<TParameters, TOverrideParameters>) => {
        const formatted = format(args as any)
        if (exclude) {
          for (const key of exclude) {
            delete (formatted as any)[key]
          }
        }
        return {
          ...formatted,
          ...overrides(args),
        } as Prettify<Assign<TReturnType, TOverrideReturnType>> & {
          [K in TExclude[number]]: never
        }
      },
      type,
    }
  }
}
