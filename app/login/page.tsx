"use client";
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLogin } from '@/hooks/use-auth';
import { useSite } from '@/hooks/use-site';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { mutate, isPending, error } = useLogin();
  const { data: site } = useSite();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { phone, password },
      {
        onSuccess: ({ user }) => {
          if (redirect) {
            router.push(redirect);
          } else {
            router.push(user.role === 'ADMIN' ? '/admin' : '/');
          }
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="group flex flex-col items-center mb-10">
          <Logo
            alt={site?.siteName ?? "APAN"}
            src={site?.logoUrl ?? undefined}
            priority
            className="h-14 w-auto group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm animate-fade-in">
          <h1 className="text-xl font-semibold text-center">Welcome back</h1>
          <p className="text-sm text-muted text-center mt-1 mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-sm text-muted text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="text-black font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
