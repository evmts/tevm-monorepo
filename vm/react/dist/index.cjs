'use strict';

var superjson = require('superjson');
var viem = require('viem');
var util = require('@ethereumjs/util');
var trie = require('@ethereumjs/trie');
var debug = require('debug');
var keccak_js = require('ethereum-cryptography/keccak.js');
var statemanager = require('@ethereumjs/statemanager');
var common = require('@ethereumjs/common');

// src/client/createClient.ts
function createClient(rpcUrl) {
  const httpRequest = viem.http(rpcUrl)({});
  const request = async (r) => {
    const asSuperJson = JSON.parse(superjson.stringify(r));
    return httpRequest.request(asSuperJson);
  };
  return {
    request,
    runScript: async (action) => {
      const res = await request({
        jsonrpc: "2.0",
        method: "tevm_script",
        params: action
      });
      const parsedSuperjson = superjson.parse(JSON.stringify(res.result));
      return parsedSuperjson;
    },
    putAccount: async (action) => {
      const res = await request({
        jsonrpc: "2.0",
        method: "tevm_putAccount",
        params: action
      });
      const parsedSuperjson = superjson.parse(JSON.stringify(res.result));
      return parsedSuperjson;
    },
    putContractCode: async (action) => {
      const res = await request({
        jsonrpc: "2.0",
        method: "tevm_putContractCode",
        params: action
      });
      const parsedSuperjson = superjson.parse(JSON.stringify(res.result));
      return parsedSuperjson;
    },
    runCall: async (action) => {
      const res = await request({
        jsonrpc: "2.0",
        method: "tevm_call",
        params: action
      });
      const parsedSuperjson = superjson.parse(JSON.stringify(res.result));
      return parsedSuperjson;
    },
    runContractCall: async (action) => {
      const res = await request({
        jsonrpc: "2.0",
        method: "tevm_contractCall",
        params: action
      });
      const parsedSuperjson = superjson.parse(JSON.stringify(res.result));
      return parsedSuperjson;
    }
  };
}
var DEFAULT_BALANCE = viem.parseEther("1000");
var putAccountHandler = async (tevm, { account, balance = DEFAULT_BALANCE }) => {
  const address = new util.Address(viem.hexToBytes(account));
  await tevm._evm.stateManager.putAccount(
    address,
    new util.Account(BigInt(0), balance)
  );
  const out = await tevm._evm.stateManager.getAccount(address);
  if (!out) {
    throw new Error("Account not successfuly put");
  }
  return out;
};
var runCallHandler = async (tevm, action) => {
  return tevm._evm.runCall({
    ...action.to && {
      to: new util.Address(viem.hexToBytes(action.to))
    },
    caller: new util.Address(viem.hexToBytes(action.caller)),
    gasLimit: action.gasLimit ?? viem.maxInt256,
    data: viem.hexToBytes(action.data),
    value: action.value ?? 0n,
    ...action.origin && {
      origin: new util.Address(viem.hexToBytes(action.origin))
    }
  });
};

// src/actions/contractCall/defaultCaller.js
var defaultCaller = "0x0000000000000000000000000000000000000000";

// src/actions/contractCall/defaultGasLimit.js
var defaultGasLimit = BigInt(4503599627370495);
var ContractDoesNotExistError = class extends Error {
  /**
   * @type {'ContractDoesNotExistError'}
   * @override
   */
  name = "ContractDoesNotExistError";
  /**
   * @type {'ContractDoesNotExistError'}
   */
  _tag = "ContractDoesNotExistError";
  /**
   * @param {string} contractAddress
   */
  constructor(contractAddress) {
    super(
      `Contract ${contractAddress} does not exist because no bytecode was found at the address`
    );
  }
};
var runContractCallHandler = async (tevm, {
  abi,
  args,
  functionName,
  caller = defaultCaller,
  contractAddress,
  gasLimit = defaultGasLimit
}) => {
  if (caller === defaultCaller) {
    await putAccountHandler(tevm, {
      account: defaultCaller,
      balance: BigInt(286331153)
    });
  }
  const contract = await tevm._evm.stateManager.getContractCode(
    util.Address.fromString(contractAddress)
  );
  if (contract.length === 0) {
    throw new ContractDoesNotExistError(contractAddress);
  }
  const result = await runCallHandler(tevm, {
    to: contractAddress,
    caller,
    origin: caller,
    // pass lots of gas
    gasLimit,
    data: viem.encodeFunctionData(
      /** @type {any} */
      {
        abi,
        functionName,
        args
      }
    )
  });
  if (result.execResult.exceptionError) {
    throw result.execResult.exceptionError;
  }
  return {
    gasUsed: result.execResult.executionGasUsed,
    logs: result.execResult.logs ?? [],
    data: viem.decodeFunctionResult(
      /** @type any */
      {
        abi,
        data: viem.toHex(result.execResult.returnValue),
        functionName
      }
    )
  };
};
var putContractCodeHandler = async (tevm, action) => {
  const ethAddress = new util.Address(viem.hexToBytes(action.contractAddress));
  await tevm._evm.stateManager.putContractCode(
    ethAddress,
    viem.hexToBytes(action.deployedBytecode)
  );
  return tevm._evm.stateManager.getContractCode(ethAddress);
};

// src/actions/runScript/runScriptHandler.js
var runScriptHandler = async (tevm, { deployedBytecode, args, abi, caller, functionName }) => {
  const contractAddress = "0x00000000000000000000000000000000000000ff";
  await putContractCodeHandler(tevm, {
    contractAddress: "0x00000000000000000000000000000000000000ff",
    deployedBytecode
  });
  return runContractCallHandler(
    tevm,
    /** @type {any} */
    {
      functionName,
      caller,
      args,
      contractAddress,
      abi
    }
  );
};

// src/jsonrpc/contractCall/tevmContractCall.js
var tevmContractCall = async (vm, request) => {
  return {
    jsonrpc: "2.0",
    result: await runContractCallHandler(vm, request.params),
    method: "tevm_contractCall",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};

// src/jsonrpc/putAccount/tevmPutAccount.js
var tevmPutAccount = async (vm, request) => {
  return {
    jsonrpc: "2.0",
    result: await putAccountHandler(vm, request.params),
    method: "tevm_putAccount",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};

// src/jsonrpc/putContractCode/tevmPutContractCode.js
var tevmPutContractCode = async (vm, request) => {
  return {
    jsonrpc: "2.0",
    result: await putContractCodeHandler(vm, request.params),
    method: "tevm_putContractCode",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};

// src/jsonrpc/runCall/tevmCall.js
var tevmCall = async (vm, request) => {
  return {
    jsonrpc: "2.0",
    result: await runCallHandler(vm, request.params),
    method: "tevm_call",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};

// src/jsonrpc/runScript/tevmScript.js
var tevmScript = async (vm, request) => {
  return {
    jsonrpc: "2.0",
    result: await runScriptHandler(vm, request.params),
    method: "tevm_script",
    ...request.id === void 0 ? {} : { id: request.id }
  };
};

// src/jsonrpc/createJsonRpcClient.ts
var UnknownMethodError = class extends Error {
  name = "UnknownMethodError";
  _tag = "UnknownMethodError";
  constructor(request) {
    super(`Unknown method in request: ${JSON.stringify(request)}`);
  }
};
var createJsonRpcClient = (tevm) => {
  return (request) => {
    switch (request.method) {
      case "tevm_call":
        return tevmCall(tevm, request);
      case "tevm_contractCall":
        return tevmContractCall(tevm, request);
      case "tevm_putAccount":
        return tevmPutAccount(tevm, request);
      case "tevm_putContractCode":
        return tevmPutContractCode(tevm, request);
      case "tevm_script":
        return tevmScript(tevm, request);
      default:
        throw new UnknownMethodError(request);
    }
  };
};
function createHttpHandler(tevm) {
  const client = createJsonRpcClient(tevm);
  return async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      let jsonBody;
      try {
        const raw = JSON.parse(body);
        if (!raw.method.startsWith("tevm_")) {
          if (!tevm.forkUrl) {
            res.writeHead(404, { "Content-Type": "application/json" });
            const error = {
              id: raw.id,
              method: raw.method,
              jsonrpc: "2.0",
              error: {
                code: 404,
                message: "Invalid jsonrpc request: Fork url not set"
              }
            };
            res.end(JSON.stringify(error));
            return;
          }
          fetch(tevm.forkUrl, {
            method: "POST",
            body: JSON.stringify(raw),
            headers: {
              "Content-Type": "application/json"
            }
          }).then((response) => {
            res.writeHead(
              response.status,
              Object.fromEntries(response.headers.entries())
            );
            res.end(response.body);
          });
        }
        jsonBody = { ...raw, params: raw.params && superjson.parse(raw.params) };
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        const error = {
          id: "unknown",
          method: "unknown",
          jsonrpc: "2.0",
          error: {
            code: 500,
            message: "Invalid jsonrpc request: Unable to parse json"
          }
        };
        res.end(JSON.stringify(error));
        return;
      }
      if (jsonBody.jsonrpc !== "2.0") {
        res.writeHead(500, { "Content-Type": "application/json" });
        const error = {
          id: "unknown",
          method: "unknown",
          jsonrpc: "2.0",
          error: {
            code: 500,
            message: `Invalid jsonrpc request: Invalid schema ${jsonBody.jsonrpc}`
          }
        };
        res.end(JSON.stringify(error));
        return;
      }
      if (jsonBody.method === "" || typeof jsonBody.method !== "string") {
        res.writeHead(500, { "Content-Type": "application/json" });
        const error = {
          id: "unknown",
          method: "unknown",
          jsonrpc: "2.0",
          error: {
            code: 500,
            message: "Invalid jsonrpc request"
          }
        };
        res.end(JSON.stringify(error));
        return;
      }
      client(jsonBody).then((result) => {
        try {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(superjson.stringify(result));
          return;
        } catch (e) {
          res.writeHead(500, { "Content-Type": "application/json" });
          const error = {
            id: jsonBody.id,
            method: jsonBody.method,
            jsonrpc: jsonBody.jsonrpc,
            error: {
              code: 500,
              message: "Internal server error"
            }
          };
          res.end(JSON.stringify(error));
          return;
        }
      }).catch((e) => {
        console.error(e);
        res.writeHead(500, { "Content-Type": "application/json" });
        const error = {
          id: jsonBody.id,
          method: jsonBody.method,
          jsonrpc: jsonBody.jsonrpc,
          error: {
            code: 404,
            message: `Request method ${jsonBody.method} not supported`
          }
        };
        res.end(JSON.stringify(error));
        return;
      });
    });
  };
}
var toUnprefixedHex = (...params) => {
  return viem.toHex(...params).slice(2);
};
var Cache = class {
  map;
  getContractStorage;
  constructor(getContractStorage) {
    this.map = /* @__PURE__ */ new Map();
    this.getContractStorage = getContractStorage;
  }
  async get(address, key) {
    const cachedValue = this.map.get(toUnprefixedHex(address.bytes))?.get(toUnprefixedHex(key));
    if (cachedValue !== void 0) {
      return cachedValue;
    }
    const value = await this.getContractStorage(address, key);
    this.put(address, key, value);
    return value;
  }
  put(address, key, value) {
    const addressHex = toUnprefixedHex(address.bytes);
    let map = this.map.get(addressHex);
    if (map === void 0) {
      map = /* @__PURE__ */ new Map();
      this.map.set(addressHex, map);
    }
    const keyHex = toUnprefixedHex(key);
    if (map?.has(keyHex) === false) {
      map?.set(keyHex, value);
    }
  }
  clear() {
    this.map = /* @__PURE__ */ new Map();
  }
};
var ViemStateManager = class _ViemStateManager {
  _contractCache;
  _storageCache;
  _blockTag;
  _accountCache;
  originalStorageCache;
  _debug;
  DEBUG;
  client;
  constructor(opts) {
    this.DEBUG = false;
    this.client = opts.client;
    this._debug = debug.debug("statemanager:viemStateManager");
    this._blockTag = opts.blockTag === "earliest" ? { blockTag: opts.blockTag } : { blockNumber: opts.blockTag };
    this._contractCache = /* @__PURE__ */ new Map();
    this._storageCache = new statemanager.StorageCache({
      size: 1e5,
      type: statemanager.CacheType.ORDERED_MAP
    });
    this._accountCache = new statemanager.AccountCache({
      size: 1e5,
      type: statemanager.CacheType.ORDERED_MAP
    });
    this.originalStorageCache = new Cache(this.getContractStorage.bind(this));
  }
  /**
   * Returns a new instance of the ViemStateManager with the same opts
   */
  shallowCopy() {
    const newState = new _ViemStateManager({
      client: this.client,
      blockTag: Object.values(this._blockTag)[0]
    });
    newState._contractCache = new Map(this._contractCache);
    newState._storageCache = new statemanager.StorageCache({
      size: 1e5,
      type: statemanager.CacheType.ORDERED_MAP
    });
    newState._accountCache = new statemanager.AccountCache({
      size: 1e5,
      type: statemanager.CacheType.ORDERED_MAP
    });
    return newState;
  }
  /**
   * Sets the new block tag and clears the internal cache
   */
  setBlockTag(blockTag) {
    this._blockTag = blockTag === "earliest" ? { blockTag } : { blockNumber: blockTag };
    this.clearCaches();
    if (this.DEBUG) {
      this._debug(`setting block tag to ${this._blockTag}`);
    }
  }
  /**
   * Resets all internal caches
   */
  clearCaches() {
    this._contractCache.clear();
    this._storageCache.clear();
    this._accountCache.clear();
  }
  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Uint8Array>} - Resolves with the code corresponding to the provided address.
   * Returns an empty `Uint8Array` if the account has no associated code.
   */
  async getContractCode(address) {
    let codeBytes = this._contractCache.get(address.toString());
    if (codeBytes !== void 0)
      return codeBytes;
    const code = await this.client.getBytecode({
      address: address.toString(),
      ...this._blockTag
    });
    codeBytes = viem.hexToBytes(code ?? "0x0");
    this._contractCache.set(address.toString(), codeBytes);
    return codeBytes;
  }
  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address, value) {
    this._contractCache.set(address.toString(), value);
  }
  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address - Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @returns {Uint8Array} - The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exist an empty `Uint8Array` is returned.
   */
  async getContractStorage(address, key) {
    if (key.length !== 32) {
      throw new Error("Storage key must be 32 bytes long");
    }
    const cachedValue = this._storageCache?.get(address, key);
    if (cachedValue !== void 0) {
      return cachedValue;
    }
    const storage = await this.client.getStorageAt({
      address: address.toString(),
      slot: viem.bytesToHex(key),
      ...this._blockTag
    });
    const value = viem.hexToBytes(storage ?? "0x0");
    await this.putContractStorage(address, key, value);
    return value;
  }
  /**
   * Adds value to the cache for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address - Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`.
   * Cannot be more than 32 bytes. Leading zeros are stripped.
   * If it is empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address, key, value) {
    this._storageCache.put(address, key, value);
  }
  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address - Address to clear the storage of
   */
  async clearContractStorage(address) {
    this._storageCache.clearContractStorage(address);
  }
  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are the storage keys, values are the storage values as strings.
   * Both are represented as `0x` prefixed hex strings.
   */
  dumpStorage(address) {
    const storageMap = this._storageCache.dump(address);
    const dump = {};
    if (storageMap !== void 0) {
      for (const slot of storageMap) {
        dump[slot[0]] = viem.bytesToHex(slot[1]);
      }
    }
    return Promise.resolve(dump);
  }
  dumpStorageRange(_address, _startKey, _limit) {
    return Promise.reject();
  }
  /**
   * Checks if an `account` exists at `address`
   * @param address - Address of the `account` to check
   */
  async accountExists(address) {
    if (this.DEBUG)
      this._debug?.(`verify if ${address.toString()} exists`);
    const localAccount = this._accountCache.get(address);
    if (localAccount !== void 0)
      return true;
    const proof = await this.client.getProof({
      address: address.toString(),
      storageKeys: [],
      ...this._blockTag
    });
    const proofBuf = proof.accountProof.map(
      (proofNode) => viem.toBytes(proofNode)
    );
    const trie$1 = new trie.Trie({ useKeyHashing: true });
    const verified = await trie$1.verifyProof(
      keccak_js.keccak256(proofBuf[0]),
      address.bytes,
      proofBuf
    );
    return verified !== null;
  }
  /**
   * Gets the code corresponding to the provided `address`.
   */
  async getAccount(address) {
    const elem = this._accountCache?.get(address);
    if (elem !== void 0) {
      return elem.accountRLP !== void 0 ? util.Account.fromRlpSerializedAccount(elem.accountRLP) : void 0;
    }
    const rlp = (await this.getAccountFromProvider(address)).serialize();
    const account = rlp !== null ? util.Account.fromRlpSerializedAccount(rlp) : void 0;
    this._accountCache?.put(address, account);
    return account;
  }
  /**
   * Retrieves an account from the provider and stores in the local trie
   * @param address Address of account to be retrieved from provider
   * @private
   */
  async getAccountFromProvider(address) {
    if (this.DEBUG)
      this._debug(
        `retrieving account data from ${address.toString()} from provider`
      );
    const accountData = await this.client.getProof({
      address: address.toString(),
      storageKeys: [],
      ...this._blockTag
    });
    const account = util.Account.fromAccountData({
      balance: BigInt(accountData.balance),
      nonce: BigInt(accountData.nonce),
      codeHash: viem.toBytes(accountData.codeHash),
      storageRoot: viem.toBytes(accountData.storageHash)
    });
    return account;
  }
  /**
   * Saves an account into state under the provided `address`.
   */
  async putAccount(address, account) {
    if (this.DEBUG) {
      this._debug(
        `Save account address=${address} nonce=${account?.nonce} balance=${account?.balance} contract=${account?.isContract() ? "yes" : "no"} empty=${account?.isEmpty() ? "yes" : "no"}`
      );
    }
    if (account !== void 0) {
      this._accountCache?.put(address, account);
    } else {
      this._accountCache?.del(address);
    }
  }
  /**
   * Gets the account associated with `address`, modifies the given account
   * fields, then saves the account into state. Account fields can include
   * `nonce`, `balance`, `storageRoot`, and `codeHash`.
   * @param address - Address of the account to modify
   * @param accountFields - Object containing account fields and values to modify
   */
  async modifyAccountFields(address, accountFields) {
    if (this.DEBUG) {
      this._debug(`modifying account fields for ${address.toString()}`);
      this._debug(
        JSON.stringify(
          accountFields,
          (k, v) => {
            if (k === "nonce")
              return v.toString();
            return v;
          },
          2
        )
      );
    }
    let account = await this.getAccount(address);
    if (!account) {
      account = new util.Account();
    }
    account.nonce = accountFields.nonce ?? account.nonce;
    account.balance = accountFields.balance ?? account.balance;
    account.storageRoot = accountFields.storageRoot ?? account.storageRoot;
    account.codeHash = accountFields.codeHash ?? account.codeHash;
    await this.putAccount(address, account);
  }
  /**
   * Deletes an account from state under the provided `address`.
   * @param address - Address of the account which should be deleted
   */
  async deleteAccount(address) {
    if (this.DEBUG) {
      this._debug(`deleting account corresponding to ${address.toString()}`);
    }
    this._accountCache.del(address);
  }
  /**
   * Get an EIP-1186 proof from the provider
   * @param address address to get proof of
   * @param storageSlots storage slots to get proof of
   * @returns an EIP-1186 formatted proof
   */
  async getProof(address, storageSlots = []) {
    if (this.DEBUG)
      this._debug(`retrieving proof from provider for ${address.toString()}`);
    const proof = await this.client.getProof({
      address: address.toString(),
      storageKeys: storageSlots.map((slot) => viem.bytesToHex(slot)),
      ...this._blockTag
    });
    return {
      address: proof.address,
      accountProof: proof.accountProof,
      balance: viem.toHex(proof.balance),
      codeHash: proof.codeHash,
      nonce: viem.toHex(proof.nonce),
      storageHash: proof.storageHash,
      storageProof: proof.storageProof.map((p) => ({
        proof: p.proof,
        value: viem.toHex(p.value),
        key: p.key
      }))
    };
  }
  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   *
   * Partial implementation, called from the subclass.
   */
  async checkpoint() {
    this._accountCache.checkpoint();
    this._storageCache.checkpoint();
  }
  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   *
   * Partial implementation, called from the subclass.
   */
  async commit() {
    this._accountCache.commit();
  }
  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   *
   * Partial implementation , called from the subclass.
   */
  async revert() {
    this._accountCache.revert();
    this._storageCache.revert();
    this._contractCache.clear();
  }
  async flush() {
    this._accountCache.flush();
  }
  /**
   * @deprecated This method is not used by the Viem State Manager and is a stub required by the State Manager interface
   */
  getStateRoot = async () => {
    return new Uint8Array(32);
  };
  /**
   * @deprecated This method is not used by the Viem State Manager and is a stub required by the State Manager interface
   */
  setStateRoot = async (_root) => {
  };
  /**
   * @deprecated This method is not used by the Viem State Manager and is a stub required by the State Manager interface
   */
  hasStateRoot = () => {
    throw new Error("function not implemented");
  };
  generateCanonicalGenesis(_initState) {
    return Promise.resolve();
  }
};
var createTevm = async (options = {}) => {
  const { EVM: _EVM } = await import('@ethereumjs/evm');
  let stateManager;
  if (options.fork?.url) {
    const client = viem.createPublicClient({
      transport: viem.http(options.fork.url)
    });
    const blockTag = options.fork.blockTag ?? await client.getBlockNumber();
    stateManager = new ViemStateManager({ client, blockTag });
  } else {
    stateManager = new statemanager.DefaultStateManager();
  }
  const chainId = 1;
  const hardfork = common.Hardfork.Shanghai;
  const common$1 = new common.Common({ chain: chainId, hardfork });
  const evm = new _EVM({
    common: common$1,
    stateManager,
    // blockchain, // Always running the EVM statelessly so not including blockchain
    allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
    allowUnlimitedInitCodeSize: false,
    customOpcodes: [],
    // TODO uncomment the mapping once we make the api correct
    customPrecompiles: options.customPrecompiles ?? [],
    // : customPrecompiles.map(p => ({ ...p, address: new EthjsAddress(hexToBytes(p.address)) })),
    profiler: {
      enabled: false
    }
  });
  const request = (request2) => {
    return createJsonRpcClient2()(request2);
  };
  const createJsonRpcClient2 = () => {
    return createJsonRpcClient(tevm);
  };
  const createHttpHandler3 = () => {
    return createHttpHandler(tevm);
  };
  const runScript = async (action) => {
    return runScriptHandler(tevm, action);
  };
  const putAccount = async (action) => {
    return putAccountHandler(tevm, action);
  };
  const putContractCode = async (action) => {
    return putContractCodeHandler(tevm, action);
  };
  const runCall = async (action) => {
    return runCallHandler(tevm, action);
  };
  const runContractCall = async (action) => {
    return runContractCallHandler(tevm, action);
  };
  const tevm = {
    _evm: evm,
    request,
    createJsonRpcClient: createJsonRpcClient2,
    createHttpHandler: createHttpHandler3,
    runScript,
    putAccount,
    putContractCode,
    runCall,
    runContractCall,
    ...options.fork?.url ? { forkUrl: options.fork.url } : { forkUrl: options.fork?.url }
  };
  return tevm;
};

exports.createClient = createClient;
exports.createTevm = createTevm;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map