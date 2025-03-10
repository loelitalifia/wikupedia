'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (res?.error) {
      alert(res.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex text-gray-700">
      {/* Logo - Sisi kiri */}
      <div className="w-1/2 bg-gray-100 flex justify-center items-center">
        <img src="/images/programmer.png" alt="Logo" />
      </div>

      {/* Form Login - Sisi kanan */}
      <div className="w-1/2 flex justify-center items-center bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold text-center mb-8">Login</h2>

          {/* ✅ Form utama, tanpa form di dalamnya */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-600 text-white rounded-lg mt-4 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Jika belum punya akun, Silahkan kontak tim BK terlebih dahulu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
