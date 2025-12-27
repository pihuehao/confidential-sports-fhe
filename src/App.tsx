import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Toaster } from 'react-hot-toast';
import { Shield, Users, FileText, TrendingUp, Lock, Zap } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TeamPanel from './components/TeamPanel';
import AthletePanel from './components/AthletePanel';
import ProposalPanel from './components/ProposalPanel';

type Tab = 'dashboard' | 'teams' | 'athletes' | 'proposals';

function App() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster position="top-right" />
      <Header />

      {!isConnected ? (
        <LandingPage />
      ) : (
        <main className="container mx-auto px-4 py-8">
          {/* Navigation Tabs */}
          <nav className="flex gap-2 mb-8 p-1 bg-[var(--bg-secondary)] rounded-lg w-fit">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'teams', label: 'Teams', icon: Users },
              { id: 'athletes', label: 'Athletes', icon: Shield },
              { id: 'proposals', label: 'Proposals', icon: FileText },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === id
                    ? 'bg-[var(--accent-purple)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="animate-fadeIn">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'teams' && <TeamPanel />}
            {activeTab === 'athletes' && <AthletePanel />}
            {activeTab === 'proposals' && <ProposalPanel />}
          </div>
        </main>
      )}
    </div>
  );
}

function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-purple)]/20 rounded-full mb-6">
          <Lock size={16} className="text-[var(--accent-purple)]" />
          <span className="text-sm text-[var(--accent-purple)]">Powered by Zama FHE</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)] bg-clip-text text-transparent">
            Confidential
          </span>
          <br />
          Sports Contracts
        </h1>

        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
          Privacy-preserving athlete salary management using Fully Homomorphic Encryption.
          Negotiate contracts without revealing sensitive financial data.
        </p>

        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          icon={Lock}
          title="Encrypted Salaries"
          description="All salary data remains encrypted on-chain. Only authorized parties can view specific values."
        />
        <FeatureCard
          icon={Shield}
          title="Salary Cap Compliance"
          description="Verify team salary caps without revealing individual salaries using FHE comparisons."
        />
        <FeatureCard
          icon={Zap}
          title="Gateway Callbacks"
          description="Secure asynchronous decryption via Zama Gateway for authorized operations."
        />
      </div>

      {/* Tech Stack */}
      <div className="mt-16 text-center">
        <p className="text-[var(--text-secondary)] mb-4">Built with</p>
        <div className="flex justify-center gap-6 flex-wrap">
          {['fhevm-solidity 0.9.1', 'Zama Gateway', 'relayer-sdk 0.3.0-8', 'React', 'wagmi'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="card-gradient rounded-xl p-6 hover:glow-purple transition-all duration-300">
      <div className="w-12 h-12 bg-[var(--accent-purple)]/20 rounded-lg flex items-center justify-center mb-4">
        <Icon className="text-[var(--accent-purple)]" size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm">{description}</p>
    </div>
  );
}

export default App;
