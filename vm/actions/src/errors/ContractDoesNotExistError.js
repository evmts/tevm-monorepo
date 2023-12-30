export class ContractDoesNotExistError extends Error {
  /**
   * @type {'ContractDoesNotExistError'}
   * @override
   */
  name = 'ContractDoesNotExistError'
  /**
   * @type {'ContractDoesNotExistError'}
   */
  _tag = 'ContractDoesNotExistError'

  /**
   * @param {string} contractAddress
   */
  constructor(contractAddress) {
    super(
      `Contract ${contractAddress} does not exist because no bytecode was found at the address`,
    )
  }
}

