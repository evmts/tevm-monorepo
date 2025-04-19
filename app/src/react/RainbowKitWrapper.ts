import  { createElement, type FC } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  type QueryClient
} from "@tanstack/react-query";

interface RainbowKitButtonProps {
  config: ReturnType<typeof getDefaultConfig>;
  queryClient: QueryClient;
}

export const RainbowKitButton: FC<RainbowKitButtonProps> = ({ config, queryClient }) => {
  return createElement(
    WagmiProvider,
    { config },
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(
        RainbowKitProvider,
        null,
        createElement(ConnectButton, null)
      )
    )
  );
}