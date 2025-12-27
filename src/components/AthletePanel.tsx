import { useState } from 'react';
import { Shield, UserPlus, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AthletePanel() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [athleteName, setAthleteName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSalary, setShowSalary] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName) {
      toast.error('Please enter your name');
      return;
    }

    setIsRegistering(true);
    try {
      // TODO: Integrate with contract
      toast.success('Athlete registration initiated');
      setShowRegisterForm(false);
      setAthleteName('');
    } catch (error) {
      toast.error('Failed to register');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Athlete Portal</h2>
          <p className="text-[var(--text-secondary)]">Register and manage your profile with encrypted salary data</p>
        </div>
        <button
          onClick={() => setShowRegisterForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={18} />
          Register as Athlete
        </button>
      </div>

      {/* Register Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-gradient rounded-xl p-6 w-full max-w-md m-4 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-[var(--accent-purple)]" />
              Register as Athlete
            </h3>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  placeholder="Enter your name"
                  className="input-field"
                />
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                <p className="text-sm text-[var(--text-secondary)]">
                  <Lock size={14} className="inline mr-1" />
                  Your wallet address will be linked to your profile. All salary data
                  will be encrypted and only visible to you and authorized parties.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="btn-primary flex-1"
                >
                  {isRegistering ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Athlete Profile Card */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="font-semibold mb-4">Your Profile</h3>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-[var(--text-secondary)]" />
          </div>
          <p className="text-[var(--text-secondary)] mb-2">Not registered yet</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Register to receive contract proposals from teams
          </p>
        </div>
      </div>

      {/* Encrypted Data Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-gradient rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Lock size={18} className="text-[var(--accent-green)]" />
              Encrypted Salary
            </h3>
            <button
              onClick={() => setShowSalary(!showSalary)}
              className="text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              {showSalary ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 font-mono text-sm">
            {showSalary ? (
              <span className="text-[var(--text-secondary)]">No salary data yet</span>
            ) : (
              <span className="text-[var(--accent-purple)]">••••••••••••</span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Only you can request decryption of your salary
          </p>
        </div>

        <div className="card-gradient rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Lock size={18} className="text-[var(--accent-blue)]" />
            Encrypted Bonus
          </h3>
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 font-mono text-sm">
            <span className="text-[var(--accent-purple)]">••••••••••••</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Bonus data is also encrypted using FHE
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="card-gradient rounded-xl p-6">
        <h3 className="font-semibold mb-3">Privacy Features for Athletes</h3>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--accent-purple)]">•</span>
            Your salary is never visible on-chain to anyone except you
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--accent-purple)]">•</span>
            You can grant temporary access to specific addresses (agents, accountants)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--accent-purple)]">•</span>
            Approve or reject proposals without revealing your current salary
          </li>
        </ul>
      </div>
    </div>
  );
}
