import {
  JsonRpcProvider,
} from "ethers";
import {
  type Client as TevmClient,
  createClient as createTevmClient
} from '@tevm/client'
import type {
  BigNumberish,
  BytesLike,
  Numeric,
  JsonRpcApiProviderOptions,
  Networkish
} from "ethers";
import type { Abi } from "abitype";
import type {
  PutAccountAction,
  PutContractCodeAction,
  RunCallAction,
  RunContractCallAction,
  RunContractCallResponse,
  RunScriptAction,
  RunScriptResponse
} from "@tevm/actions";
import type {
  TevmPutAccountResponse,
  TevmPutContractCodeResponse,
  TevmCallResponse,
  TevmJsonRpcRequest,
  BackendReturnType,
} from '@tevm/jsonrpc'

export interface AccountState {
  balance?: BigNumberish;
  code?: BytesLike;
  nonce?: Numeric;
}

export type TevmMethods = Omit<TevmClient, 'request'> & { tevmRequest: TevmClient['request'] }

export class TevmJsonRpcProvider extends JsonRpcProvider implements TevmMethods {
  private readonly tevmClient: TevmClient;

  constructor(url: string, network?: Networkish, options?: JsonRpcApiProviderOptions) {
    super(url, network, options);

    this.tevmClient = createTevmClient(url)
  }

  public readonly tevmRequest = <T extends TevmJsonRpcRequest>(r: T): Promise<BackendReturnType<T>> => {
    return this.tevmClient.request(r)
  }

  public readonly runScript = <
    TAbi extends Abi | readonly unknown[] = Abi,
    TFunctionName extends string = string,
  >(
    action: RunScriptAction<TAbi, TFunctionName>,
  ): Promise<RunScriptResponse<TAbi, TFunctionName>> => {
    return this.tevmClient.runScript(action)
  }

  public readonly putAccount = (action: PutAccountAction): Promise<TevmPutAccountResponse> => {
    return this.tevmClient.putAccount(action)
  }

  public readonly putContractCode = (
    action: PutContractCodeAction,
  ): Promise<TevmPutContractCodeResponse> => {
    return this.tevmClient.putContractCode(action)
  }

  public readonly runCall = (action: RunCallAction): Promise<TevmCallResponse> => {
    return this.tevmClient.runCall(action)
  }

  public readonly runContractCall = <
    TAbi extends Abi | readonly unknown[] = Abi,
    TFunctionName extends string = string,
  >(
    action: RunContractCallAction<TAbi, TFunctionName>,
  ): Promise<RunContractCallResponse<TAbi, TFunctionName>> => {
    return this.tevmClient.runContractCall(action)
  }
}
