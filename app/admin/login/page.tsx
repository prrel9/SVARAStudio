"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      // 1. Sign in with password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !authData.user) {
        setErrorMsg(authError?.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      // 2. Verify admin role from admin_profiles table
      const { data: profile, error: profileError } = await supabase
        .from("admin_profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (profileError || !profile || profile.role !== "admin") {
        // Sign out unprivileged user
        await supabase.auth.signOut();
        setErrorMsg("Access Denied: Your account does not have administrator privileges.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Authentication successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 800);
    } catch {
      setErrorMsg("An unexpected error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 py-12 selection:bg-accent selection:text-background relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent hover:bg-accent hover:text-background transition-all shadow-lg shadow-accent/10"
            title="Back to Website"
          >
            <Shield className="h-7 w-7" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2.5 py-0.5 rounded-md border border-accent/20">
              Admin Gateway
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">
              SVARA STUDIO
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Sign in with your administrative account to access the dashboard.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-border-custom bg-surface p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          {/* Error Message Alert */}
          {errorMsg && (
            <div className="flex items-start gap-3 rounded-2xl border border-error-custom/40 bg-error-custom/10 p-4 text-xs font-semibold text-error-custom animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMsg && (
            <div className="flex items-center gap-3 rounded-2xl border border-success-custom/40 bg-success-custom/10 p-4 text-xs font-semibold text-success-custom animate-fadeIn">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@faulshouse.com"
                  className="w-full rounded-2xl border border-border-custom bg-bg-secondary pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-border-custom bg-bg-secondary pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-extrabold text-background hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-accent/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-text-secondary hover:text-white transition-colors"
          >
            ← Return to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}
