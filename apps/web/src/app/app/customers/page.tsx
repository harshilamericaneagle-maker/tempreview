"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  consentSms: boolean;
  consentEmail: boolean;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const load = async () => {
    const res = await fetch("/api/customers");
    const json = (await res.json()) as { ok: boolean; data: Customer[] };
    if (json.ok) setCustomers(json.data);
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: email || undefined,
        consentSms: false,
        consentEmail: true,
      }),
    });
    setName("");
    setEmail("");
    void load();
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="glass-card rounded-xl p-4 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="px-3 py-2 rounded-lg bg-secondary/50 border border-border"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="px-3 py-2 rounded-lg bg-secondary/50 border border-border"
        />
        <button onClick={create} className="px-4 py-2 rounded-lg btn-primary text-white">
          Add
        </button>
      </div>
      <div className="space-y-2">
        {customers.map((c) => (
          <div key={c.id} className="glass-card rounded-xl p-4">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-muted-foreground">
              {c.email || c.phone || "No contact"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
