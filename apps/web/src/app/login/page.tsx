"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Eye, EyeOff, Zap, Star } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent, overrideEmail?: string, overridePass?: string) => {
    e?.preventDefault();
    const em = overrideEmail ?? email;
    const pw = overridePass ?? password;
    setLoading(true);
    setError("");
    const result = await login(em, pw);
    setLoading(false);
    if (result.success) {
      if (em === "admin@reviewhub.com") router.push("/admin");
      else router.push("/app");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-primary">ReviewHub</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-primary text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <div className="text-right">
              <Link href="/forgot" className="text-xs text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo Login */}
          <button
            onClick={(e) => handleLogin(e, "demo@reviewhub.com", "demo1234")}
            className="w-full py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 font-semibold text-sm hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 mb-3"
          >
            <Zap className="w-4 h-4" />
            Try Demo Account — No signup needed
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-xl p-3">
            <div>
              <div className="font-medium text-foreground mb-1">🔴 Admin Login</div>
              <div>admin@reviewhub.com</div>
              <div>admin1234</div>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">🟣 Demo Merchant</div>
              <div>demo@reviewhub.com</div>
              <div>demo1234</div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          New merchant?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Register your business
          </Link>
        </p>
      </div>
    </div>
  );
}
