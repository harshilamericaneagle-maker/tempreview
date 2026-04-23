import Link from "next/link";

export default function ForgotPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-md glass-card rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-2">Reset password</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your account email and we will send a password reset link.
        </p>
        <form className="space-y-4">
          <input
            type="email"
            required
            placeholder="you@reviewhub.com"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl btn-primary text-white font-semibold"
          >
            Send reset link
          </button>
        </form>
        <p className="text-sm text-muted-foreground mt-6">
          Back to{" "}
          <Link href="/login" className="text-primary">
            sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
