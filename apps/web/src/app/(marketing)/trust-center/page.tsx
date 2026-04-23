import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { Shield, Lock, Server, Clock, CheckCircle, AlertTriangle, Globe, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Trust Center | Openrize",
  description:
    "Learn how Openrize protects your data, ensures uptime, and maintains the highest security standards.",
};

export default function TrustCenterPage() {
  const securityPillars = [
    {
      icon: Lock,
      title: "Data Encryption",
      color: "from-violet-500 to-purple-600",
      items: [
        "TLS 1.3 encryption for all data in transit",
        "AES-256 encryption for data at rest",
        "Encrypted database backups",
        "Secure key management practices",
      ],
    },
    {
      icon: Server,
      title: "Infrastructure Security",
      color: "from-cyan-500 to-blue-600",
      items: [
        "Hosted on enterprise-grade cloud infrastructure",
        "Regular automated backups with point-in-time recovery",
        "DDoS protection and rate limiting",
        "Network-level firewall and intrusion detection",
      ],
    },
    {
      icon: Eye,
      title: "Access Controls",
      color: "from-emerald-500 to-green-600",
      items: [
        "Role-based access control (RBAC)",
        "Multi-factor authentication support",
        "Audit logs for all admin actions",
        "Minimum privilege access policy for staff",
      ],
    },
    {
      icon: Shield,
      title: "Application Security",
      color: "from-amber-500 to-orange-500",
      items: [
        "Regular third-party penetration testing",
        "OWASP Top 10 vulnerability mitigations",
        "Dependency vulnerability scanning in CI/CD",
        "Secure SDLC practices enforced",
      ],
    },
  ];

  const slaItems = [
    { label: "Platform Uptime SLA", value: "99.9%", color: "text-emerald-400" },
    { label: "Incident Response Time", value: "< 4 hrs", color: "text-cyan-400" },
    { label: "Support Response (Business)", value: "< 24 hrs", color: "text-violet-400" },
    { label: "Data Breach Notification", value: "72 hrs", color: "text-amber-400" },
    { label: "Backup Frequency", value: "Daily", color: "text-emerald-400" },
    { label: "Data Retention on Deletion", value: "90 days", color: "text-blue-400" },
  ];

  const complianceItems = [
    { label: "GDPR Ready", desc: "EU user data rights supported" },
    { label: "CCPA Compliant", desc: "California consumer privacy" },
    { label: "SOC 2 Type II", desc: "Controls in progress (2026)" },
    { label: "HTTPS Enforced", desc: "All connections TLS encrypted" },
  ];

  const incidentSteps = [
    {
      step: "01",
      title: "Detection",
      desc: "Automated monitoring detects anomalies in real-time.",
    },
    {
      step: "02",
      title: "Assessment",
      desc: "Security team assesses scope and severity within 1 hour.",
    },
    { step: "03", title: "Containment", desc: "Affected systems isolated and threat neutralized." },
    {
      step: "04",
      title: "Notification",
      desc: "Affected users notified within 72 hours if data is involved.",
    },
    {
      step: "05",
      title: "Remediation",
      desc: "Root cause identified and patched; full report published.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Trust Center"
        description="Our commitment to your security, privacy, and data integrity."
      />

      <section className="w-full py-16 px-6 lg:px-16 space-y-20">
        {/* Intro */}
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          At Openrize, trust is the foundation of everything we build. Over{" "}
          <strong className="text-foreground">1,500 businesses</strong> rely on our platform to
          manage their reputation and customer relationships. We take that responsibility seriously
          — investing continuously in the security, reliability, and transparency of our systems.
        </p>

        {/* Security Pillars */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">Security Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {securityPillars.map(({ icon: Icon, title, color, items }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* SLA */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">Service Level Commitments</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {slaItems.map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5 text-center">
                <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance + Incident Response side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Compliance & Certifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {complianceItems.map(({ label, desc }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center"
                >
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="font-bold text-foreground text-sm mb-1">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Incident Response Process</h2>
            <div className="space-y-3">
              {incidentSteps.map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0 mt-0.5">
                    {step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-0.5">{title}</h4>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="p-8 rounded-2xl border border-border bg-secondary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Report a Security Issue</h3>
              <p className="text-muted-foreground text-sm">
                Found a vulnerability? Contact our security team immediately. We take all reports
                seriously.
              </p>
            </div>
          </div>
          <a
            href="mailto:openize@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap flex-shrink-0"
          >
            openize@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
