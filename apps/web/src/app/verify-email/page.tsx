import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-md glass-card rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We sent a sign-in or verification link to your inbox.
        </p>
        <Link
          href="/login"
          className="inline-block py-3 px-6 rounded-xl btn-primary text-white font-semibold"
        >
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
