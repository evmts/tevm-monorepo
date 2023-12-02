import {
  RunScriptActionValidator,
  EVMts
} from '@evmts/vm'

import type { Trpc } from '../Trpc.js'
import { Route } from './Route.js'

export class RunScriptRoute extends Route {
  constructor(
    trpc: Trpc,
    protected readonly vm: EVMts,
  ) {
    super(trpc)
  }
  public readonly name = 'runScript'
  public readonly handler = this.trpc.procedure.meta({
    description: 'Execute a script on the vm',
  }).input(RunScriptActionValidator).query(async req => {
    return this.vm.runScript(req.input as any)
  })
}
