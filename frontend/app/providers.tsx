'use client';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { WagmiConfig } from 'wagmi';
import { bscTestnet } from 'viem/chains';

const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID'; // Get this from WalletConnect

const metadata = {
  name: 'TIRP',
  description: 'This Is a Rug Pull',
  url: 'https://tirp.com', // Update with your domain
  icons: ['https://tirp.com/icon.png'] // Update with your icon
};
const chains = [bscTestnet] as const;
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId });

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
} 