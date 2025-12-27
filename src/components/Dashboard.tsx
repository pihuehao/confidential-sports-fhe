import { useAccount } from 'wagmi';
import { Users, FileText, Shield, Clock, Lock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { address } = useAccount();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card-gradient rounded-xl p-6 glow-purple">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--accent-purple)]/20 rounded-full flex items-center justify-center lock-animate">
            <Lock size={28} className="text-[var(--accent-purple)]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome to Confidential Sports</h2>
            <p className="text-[var(--text-secondary)]">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Teams"
          value="--"
          color="purple"
        />
        <StatCard
          icon={Shield}
          label="Registered Athletes"
          value="--"
          color="blue"
        />
        <StatCard
          icon={FileText}
          label="Active Proposals"
          value="--"
          color="green"
        />
        <StatCard
          icon={CheckCircle}
          label="Approved Contracts"
          value="--"
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-gradient rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-[var(--accent-purple)]" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <ActivityItem
              type="info"
              message="Connect your wallet and deploy the contract to get started"
            />
            <ActivityItem
              type="tip"
              message="Create a team first, then register athletes to begin negotiations"
            />
          </div>
        </div>

        <div className="card-gradient rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="space-y-4">
            <Step number={1} text="Create a Team with an encrypted salary cap" />
            <Step number={2} text="Athletes register with their wallet" />
            <Step number={3} text="Team managers submit encrypted salary proposals" />
            <Step number={4} text="Athletes approve/reject without revealing amounts" />
            <Step number={5} text="Gateway verifies salary cap compliance via FHE" />
          </div>
        </div>
      </div>

      {/* FHE Info Banner */}
      <div className="bg-gradient-to-r from-[var(--accent-purple)]/10 to-[var(--accent-blue)]/10 rounded-xl p-6 border border-[var(--accent-purple)]/30">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Lock size={18} className="text-[var(--accent-purple)]" />
          Privacy Powered by Zama FHE
        </h3>
        <p className="text-[var(--text-secondary)] text-sm">
          All salary data is encrypted using Fully Homomorphic Encryption. The contract can perform
          calculations on encrypted values (like checking salary cap compliance) without ever decrypting
          the actual amounts. Only authorized parties with proper access can request decryption via the
          Zama Gateway.
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    purple: 'from-[var(--accent-purple)] to-purple-400',
    blue: 'from-[var(--accent-blue)] to-blue-400',
    green: 'from-[var(--accent-green)] to-green-400',
    yellow: 'from-yellow-500 to-yellow-400',
  };

  return (
    <div className="card-gradient rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-[var(--text-secondary)] text-sm">{label}</p>
    </div>
  );
}

function ActivityItem({ type, message }: { type: 'info' | 'tip'; message: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
      <div className={`w-2 h-2 rounded-full mt-2 ${type === 'info' ? 'bg-[var(--accent-blue)]' : 'bg-[var(--accent-green)]'}`} />
      <p className="text-sm text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-xs font-bold">
        {number}
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{text}</p>
    </div>
  );
}
