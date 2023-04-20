import { Chain } from "viem/chains";
import { Transport } from "viem";

type WalletClient = {}

export type WalletClientOptions = {
  chain: Chain;
  // TODO make this our transport isntead
  transport: Transport;
};

export const createWalletClient = (
  options: WalletClientOptions
): WalletClient => {
  return {};
};
