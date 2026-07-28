"use client";
import { useState } from 'react';
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
      { onSuccess: () => router.push('/') },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-3 rounded-lg"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3 rounded-lg"
        required
        minLength={6}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white py-3 rounded-lg disabled:opacity-50"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}