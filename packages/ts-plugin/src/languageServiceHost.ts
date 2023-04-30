import {
  Decorator,
  composeDecorators,
  getScriptKindDecorator,
  getScriptSnapshotDecorator,
  resolveModuleNameLiteralsDecorator,
} from './decorators'

export const languageServiceHostDecorator: Decorator = composeDecorators(
  resolveModuleNameLiteralsDecorator,
  getScriptSnapshotDecorator,
  getScriptKindDecorator,
)
