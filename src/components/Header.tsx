import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield } from 'lucide-react';
import { FHEVM_VERSION, RELAYER_SDK_VERSION } from '../config';

export default function Header() {
  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-blue)] rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Confidential Sports</h1>
            <p className="text-xs text-[var(--text-secondary)]">
              fhevm {FHEVM_VERSION} | relayer {RELAYER_SDK_VERSION}
            </p>
          </div>
        </div>

        {/* Connect Button */}
        <ConnectButton
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </header>
  );
}
