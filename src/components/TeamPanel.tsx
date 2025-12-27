import { useState } from 'react';
import { Users, Plus, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamPanel() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [salaryCap, setSalaryCap] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !salaryCap) {
      toast.error('Please fill all fields');
      return;
    }

    setIsCreating(true);
    try {
      // TODO: Integrate with contract
      // The salary cap will be encrypted before sending
      toast.success('Team creation would encrypt salary cap using FHE');
      setShowCreateForm(false);
      setTeamName('');
      setSalaryCap('');
    } catch (error) {
      toast.error('Failed to create team');
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
          <p className="text-[var(--text-secondary)]">Create and manage teams with encrypted salary caps</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Create Team
        </button>
      </div>

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
                  <Lock size={14} />
                  Salary Cap (ETH) - Will be encrypted
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
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  This value will be encrypted using FHE before storing on-chain
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
                  disabled={isCreating}
                  className="btn-primary flex-1"
                >
                  {isCreating ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="font-semibold mb-4">Your Teams</h3>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-[var(--text-secondary)]" />
          </div>
          <p className="text-[var(--text-secondary)] mb-2">No teams yet</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Deploy the contract and create your first team to get started
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Lock size={18} className="text-[var(--accent-purple)]" />
          Encrypted Salary Caps
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Team salary caps are stored as encrypted values (euint64). When proposals are submitted,
          the contract can check if the new salary would exceed the cap without ever revealing
          the actual cap amount to anyone except the team manager.
        </p>
      </div>
    </div>
  );
}
