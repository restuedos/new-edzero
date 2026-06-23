'use client';

import { useState } from 'react';

export default function LicenseActivatePage() {
  const [licenseKey, setLicenseKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (data.ok) {
        window.location.assign('/');
        return;
      }
      setMessage(data.message ?? 'Activation failed.');
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md border border-neutral-800 p-8">
        <h1 className="site-logo text-2xl">
          EDZERO<span className="text-[var(--color-accent)]">.</span>
        </h1>
        <p className="mt-2 text-sm text-neutral-400">Activate your license to use this starter.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="License key"
            required
            className="w-full border border-neutral-700 bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]"
          />
          <button type="submit" disabled={loading} className="btn-outline w-full disabled:opacity-50">
            {loading ? 'Activating…' : 'Activate License'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
        <p className="mt-6 text-xs text-neutral-600">
          Set <code className="text-neutral-400">LICENSE_VERIFY_URL=</code> empty in .env.local to disable enforcement during development.
        </p>
      </div>
    </div>
  );
}
