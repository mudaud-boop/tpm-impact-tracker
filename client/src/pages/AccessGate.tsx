import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { IntuitLogo } from '@/components/IntuitLogo';

interface AccessGateProps {
  onAccessGranted: () => void;
}

// Change this access code to whatever you want
const ACCESS_CODE = 'impact2024';

export function AccessGate({ onAccessGranted }: AccessGateProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code === ACCESS_CODE) {
      localStorage.setItem('access_granted', 'true');
      onAccessGranted();
    } else {
      setError('Invalid access code');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <IntuitLogo className="h-8 text-primary-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900">Impact Tracker</h1>
          <p className="text-gray-500 mt-2">
            Beta Access Required
          </p>
        </div>

        <div className="card p-8">
          <p className="text-sm text-gray-600 mb-6 text-center">
            This app is currently in private beta. Enter your access code to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); }}
                  className="input pl-10"
                  placeholder="Enter access code"
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Contact the administrator for access
        </p>
      </div>
    </div>
  );
}
