import { useClient } from "wagmi";
import { chainId, getWorldAddress } from "../common";
import { Account, Chain, Client, GetContractReturnType, Transport } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useSessionClient } from "@latticexyz/entrykit/internal";
import { observer } from "@latticexyz/explorer/observer";
import worldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import { getOptimisticContract } from "@tevm/mud";
import { memoryClient } from "./stash";

export function useWorldContract():
  | GetContractReturnType<
      typeof worldAbi,
      {
        public: Client<Transport, Chain>;
        wallet: Client<Transport, Chain, Account>;
      }
    >
  | undefined {
  const client = useClient({ chainId });
  const { data: sessionClient } = useSessionClient();

  const { data: worldContract } = useQuery({
    queryKey: ["worldContract", client?.uid, sessionClient?.uid],
    queryFn: () => {
      if (!client || !sessionClient) {
        throw new Error("Not connected.");
      }

      return getOptimisticContract(memoryClient)({
        abi: worldAbi,
        address: getWorldAddress(),
        client: {
          // TODO: fix these types
          public: client,
          wallet: sessionClient.extend(observer()),
        },
      });
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return worldContract;
}
