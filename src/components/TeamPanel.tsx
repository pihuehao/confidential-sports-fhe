import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Users, Plus, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContract } from '../hooks/useContract';
import { IS_CONTRACT_DEPLOYED } from '../config';

interface Team {
  id: number;
  name: string;
  manager: string;
  athleteCount: number;
  isActive: boolean;
}

export default function TeamPanel() {
  const { address } = useAccount();
  const { createTeam, getTeamInfo, getTeamCount, isLoading, fhevmReady, fhevmLoading, isDemoMode } = useContract();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [salaryCap, setSalaryCap] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Load teams on mount
  useEffect(() => {
    if (IS_CONTRACT_DEPLOYED) {
      loadTeams();
    }
  }, []);

  const loadTeams = async () => {
    setLoadingTeams(true);
    try {
      const count = await getTeamCount();
      const teamList: Team[] = [];

      for (let i = 1; i <= Number(count); i++) {
        const info = await getTeamInfo(i);
        teamList.push({
          id: i,
          name: info[0],
          manager: info[1],
          athleteCount: Number(info[2]),
          isActive: info[3],
        });
      }

      setTeams(teamList);
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !salaryCap) {
      toast.error('Please fill all fields');
      return;
    }

    if (!IS_CONTRACT_DEPLOYED) {
      toast.error('Contract not deployed yet. Deploy first with: npm run deploy:sepolia');
      return;
    }

    if (!fhevmReady) {
      toast.error('FHE encryption not ready. Please wait...');
      return;
    }

    setIsCreating(true);
    const toastId = toast.loading('Encrypting salary cap with FHE...');

    try {
      toast.loading('Sending encrypted transaction...', { id: toastId });
      await createTeam(teamName, salaryCap);

      toast.success('Team created with encrypted salary cap!', { id: toastId });
      setShowCreateForm(false);
      setTeamName('');
      setSalaryCap('');
      loadTeams(); // Reload teams
    } catch (error: any) {
      console.error('Create team error:', error);
      toast.error(error.message || 'Failed to create team', { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-[var(--text-secondary)]">
            Create and manage teams with encrypted salary caps
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center gap-2"
          disabled={!IS_CONTRACT_DEPLOYED}
        >
          <Plus size={18} />
          Create Team
        </button>
      </div>

      {/* FHE Status Banner */}
      <div className={`rounded-lg p-4 flex items-center gap-3 ${
        fhevmLoading ? 'bg-yellow-500/10 border border-yellow-500/30' :
        isDemoMode ? 'bg-blue-500/10 border border-blue-500/30' :
        fhevmReady ? 'bg-green-500/10 border border-green-500/30' :
        'bg-yellow-500/10 border border-yellow-500/30'
      }`}>
        {fhevmLoading ? (
          <>
            <Loader2 className="text-yellow-500 animate-spin" size={20} />
            <span className="text-yellow-400">Initializing encryption...</span>
          </>
        ) : isDemoMode ? (
          <>
            <CheckCircle className="text-blue-500" size={20} />
            <div>
              <span className="text-blue-400 font-medium">Demo Mode Active</span>
              <p className="text-blue-400/70 text-xs">Simulated encryption for demonstration</p>
            </div>
          </>
        ) : fhevmReady ? (
          <>
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-green-400">FHE Encryption Ready</span>
          </>
        ) : (
          <>
            <Loader2 className="text-yellow-500 animate-spin" size={20} />
            <span className="text-yellow-400">Connecting...</span>
          </>
        )}
      </div>

      {/* Contract Not Deployed Warning */}
      {!IS_CONTRACT_DEPLOYED && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <div>
            <p className="text-red-400 font-medium">Contract Not Deployed</p>
            <p className="text-red-400/70 text-sm">
              Run <code className="bg-red-500/20 px-2 py-0.5 rounded">npm run deploy:sepolia</code> then update CONTRACT_ADDRESS in config.ts
            </p>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-gradient rounded-xl p-6 w-full max-w-md m-4 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users size={20} className="text-[var(--accent-purple)]" />
              Create New Team
            </h3>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                  <Lock size={14} className="text-[var(--accent-purple)]" />
                  Salary Cap (ETH) - Will be FHE encrypted
                </label>
                <input
                  type="number"
                  value={salaryCap}
                  onChange={(e) => setSalaryCap(e.target.value)}
                  placeholder="e.g., 1000"
                  step="0.001"
                  min="0"
                  className="input-field"
                />
                <p className="text-xs text-[var(--accent-purple)] mt-1 flex items-center gap-1">
                  <Lock size={10} />
                  This value will be encrypted using Zama FHE before storing on-chain
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !fhevmReady}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Encrypting...
                    </>
                  ) : (
                    'Create Team'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="font-semibold mb-4">Teams ({teams.length})</h3>

        {loadingTeams ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-[var(--text-secondary)]">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-[var(--text-secondary)]" />
            </div>
            <p className="text-[var(--text-secondary)] mb-2">No teams yet</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {IS_CONTRACT_DEPLOYED
                ? 'Create your first team with an encrypted salary cap'
                : 'Deploy the contract first, then create teams'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <div key={team.id} className="bg-[var(--bg-secondary)] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{team.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Manager: {team.manager.slice(0, 6)}...{team.manager.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{team.athleteCount} athletes</p>
                  <p className="text-xs text-[var(--accent-purple)] flex items-center gap-1">
                    <Lock size={10} />
                    Salary cap encrypted
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Lock size={18} className="text-[var(--accent-purple)]" />
          How FHE Encryption Works
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          When you create a team, your salary cap is encrypted using <strong>Fully Homomorphic Encryption (FHE)</strong>
          before being stored on-chain. This means:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
          <li>• The actual salary cap value is <strong>never visible</strong> on the blockchain</li>
          <li>• The contract can still <strong>compare</strong> salaries against the cap</li>
          <li>• Only you (the manager) can <strong>decrypt</strong> and view the value</li>
        </ul>
      </div>
    </div>
  );
}
