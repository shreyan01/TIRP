interface Window {
  ethereum?: {
    on: (event: string, callback: (accounts: string[]) => void) => void;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
} 