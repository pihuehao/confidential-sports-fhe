import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ZAMA_CONFIG } from './config';

// Define Zama chain
const zamaChain = {
  id: ZAMA_CONFIG.chainId,
  name: ZAMA_CONFIG.chainName,
  nativeCurrency: ZAMA_CONFIG.currency,
  rpcUrls: {
    default: { http: [ZAMA_CONFIG.rpcUrl] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: ZAMA_CONFIG.blockExplorer },
  },
} as const;

const config = getDefaultConfig({
  appName: 'Confidential Sports',
  projectId: 'confidential-sports-fhe',
  chains: [zamaChain],
  transports: {
    [zamaChain.id]: http(ZAMA_CONFIG.rpcUrl),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
