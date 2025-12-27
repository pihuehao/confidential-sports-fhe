import { useState } from 'react';
import { FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

interface Proposal {
  id: number;
  athleteName: string;
  teamName: string;
  duration: number;
  status: ProposalStatus;
  createdAt: string;
}

export default function ProposalPanel() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    athleteId: '',
    salary: '',
    bonus: '',
    duration: '12',
  });
  const [isCreating, setIsCreating] = useState(false);

  // Mock proposals for UI demonstration
  const mockProposals: Proposal[] = [];

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athleteId || !formData.salary || !formData.bonus) {
      toast.error('Please fill all fields');
      return;
    }

    setIsCreating(true);
    try {
      // TODO: Integrate with contract
      // Salary and bonus will be encrypted before sending
      toast.success('Proposal would be created with encrypted salary/bonus');
      setShowCreateForm(false);
      setFormData({ athleteId: '', salary: '', bonus: '', duration: '12' });
    } catch (error) {
      toast.error('Failed to create proposal');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: ProposalStatus) => {
    const styles: Record<ProposalStatus, { bg: string; text: string; icon: any }> = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', icon: Clock },
      approved: { bg: 'bg-green-500/20', text: 'text-green-500', icon: CheckCircle },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-500', icon: XCircle },
      expired: { bg: 'bg-gray-500/20', text: 'text-gray-500', icon: AlertCircle },
    };

    const style = styles[status];
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${style.bg} ${style.text}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contract Proposals</h2>
          <p className="text-[var(--text-secondary)]">Create and manage encrypted salary proposals</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          New Proposal
        </button>
      </div>

      {/* Create Proposal Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-gradient rounded-xl p-6 w-full max-w-md m-4 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[var(--accent-purple)]" />
              Create Contract Proposal
            </h3>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Athlete ID
                </label>
                <input
                  type="number"
                  value={formData.athleteId}
                  onChange={(e) => setFormData({ ...formData, athleteId: e.target.value })}
                  placeholder="Enter athlete ID"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                  <Lock size={14} />
                  Proposed Salary (ETH) - Encrypted
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g., 100"
                  step="0.001"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                  <Lock size={14} />
                  Proposed Bonus (ETH) - Encrypted
                </label>
                <input
                  type="number"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                  placeholder="e.g., 10"
                  step="0.001"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Contract Duration (months)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input-field"
                >
                  {[6, 12, 24, 36, 48, 60].map((months) => (
                    <option key={months} value={months}>
                      {months} months
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  <Lock size={12} className="inline mr-1" />
                  Salary and bonus values will be encrypted using FHE before submission.
                  The athlete can view the decrypted values, but they remain hidden from others.
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
                  {isCreating ? 'Creating...' : 'Submit Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proposals List */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="font-semibold mb-4">All Proposals</h3>

        {mockProposals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-[var(--text-secondary)]" />
            </div>
            <p className="text-[var(--text-secondary)] mb-2">No proposals yet</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Team managers can create proposals for registered athletes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mockProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-[var(--bg-secondary)] rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{proposal.athleteName}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {proposal.teamName} • {proposal.duration} months
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {proposal.createdAt}
                  </span>
                  {getStatusBadge(proposal.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gateway Callback Info */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock size={18} className="text-[var(--accent-blue)]" />
          Approval Process (Gateway Callback)
        </h3>
        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
          <p>When an athlete approves a proposal:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Contract calculates new team payroll (encrypted)</li>
            <li>Compares against salary cap using FHE operations</li>
            <li>Requests decryption of comparison result via Zama Gateway</li>
            <li>Gateway callback returns true/false for cap compliance</li>
            <li>Contract approves or rejects based on result</li>
          </ol>
          <p className="mt-4">
            <strong>Note:</strong> Only the boolean result is decrypted, never the actual salary values.
          </p>
        </div>
      </div>
    </div>
  );
}
