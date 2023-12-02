import {
  PutContractCodeActionValidator,
  EVMts
} from '@evmts/vm'

import type { Trpc } from '../Trpc.js'
import { Route } from './Route.js'

export class PutContractCodeRoute extends Route {
  constructor(
    trpc: Trpc,
    protected readonly vm: EVMts,
  ) {
    super(trpc)
  }
  public readonly name = 'putContractCode'
  public readonly handler = this.trpc.procedure.meta({
    description: 'Put contract code on the vm',
  }).input(PutContractCodeActionValidator).query(async req => {
    return this.vm.putContractCode(req.input)
  })
}
