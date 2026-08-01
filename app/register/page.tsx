"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/use-auth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { mutate, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { name, phone, password },
      {
        onSuccess: ({ user }) => {
          router.push(user.role === 'ADMIN' ? '/admin' : '/');
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="group flex flex-col items-center mb-10">
          <span className="font-display text-4xl tracking-[0.15em] text-black font-bold leading-none group-hover:scale-105 transition-transform duration-300">
            APAN
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-black/60 -mt-1">
            Fashion
          </span>
        </Link>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm animate-fade-in">
          <h1 className="text-xl font-semibold text-center">Create account</h1>
          <p className="text-sm text-muted text-center mt-1 mb-8">
            Join APAN and start shopping
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-muted font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-muted font-medium">
                Phone
              </label>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-muted font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white py-3 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors mt-2"
            >
              {isPending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-sm text-muted text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-black font-medium underline underline-offset-4 hover:opacity-70 transition-opacity">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
