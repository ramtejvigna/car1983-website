"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || "Login failed. Please check your credentials.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0e0a22] via-[#140f2d] to-[#060411] font-sans antialiased">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(138,99,246,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(38,160,223,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Decorative backdrop glass circles */}
      <div className="absolute top-[15%] left-[20%] size-28 rounded-full bg-gradient-to-br from-[#8a63f6]/10 to-transparent blur-xl pointer-events-none" />
      <div className="absolute bottom-[15%] right-[20%] size-40 rounded-full bg-gradient-to-br from-[#26a0df]/10 to-transparent blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-[440px] px-6">
        {/* Brand Logo Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a63f6] to-[#6035db] text-white shadow-[0_8px_20px_-6px_rgba(138,99,246,0.6)]">
            <span className="font-heading text-2xl font-extrabold tracking-wider">C</span>
          </div>
          <h1 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-white">
            Car1983 <span className="text-[#8a63f6]">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-[#8c88a5]">
            Access the command center to manage operations
          </p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="rounded-[28px] border border-white/[0.06] bg-[#1a1535]/40 backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#a09cb8]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@car1983.com"
                className="w-full h-12 rounded-xl border border-white/[0.08] bg-[#0c091d]/60 px-4 text-[15px] text-white placeholder:text-[#524d73] focus:border-[#8a63f6] focus:outline-none focus:ring-2 focus:ring-[#8a63f6]/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#a09cb8]">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 rounded-xl border border-white/[0.08] bg-[#0c091d]/60 px-4 text-[15px] text-white placeholder:text-[#524d73] focus:border-[#8a63f6] focus:outline-none focus:ring-2 focus:ring-[#8a63f6]/20 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full h-12 overflow-hidden rounded-xl bg-gradient-to-r from-[#8a63f6] to-[#6c3cfb] font-semibold text-white shadow-[0_6px_15px_-4px_rgba(138,99,246,0.4)] transition-all hover:shadow-[0_8px_20px_-4px_rgba(138,99,246,0.5)] hover:brightness-110 active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="size-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Portal Footer */}
        <div className="mt-8 text-center text-xs text-[#524d73]">
          &copy; {new Date().getFullYear()} Car1983 Platform. Secure Connection.
        </div>
      </div>
    </div>
  );
}
