"use client";

import Link from "next/link";
import { Linkedin, Instagram, Star } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative bg-[#080B14] overflow-hidden pt-24 pb-12">
            {/* Background divider */}
            <div className="section-divider absolute top-0 left-0 right-0" />

            {/* Decorative background orb */}
            <div
                className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
                style={{ background: "#3b82f6" }}
            />

            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                    <div className="lg:col-span-5 space-y-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center relative"
                                style={{
                                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
                                }}
                            >
                                <Star className="h-4 w-4 text-white fill-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Openrize</span>
                        </Link>

                        <p className="text-lg leading-relaxed max-w-sm text-slate-400">
                            The intelligent platform for modern business reputation. From zero reviews to market dominance.
                        </p>

                        <div className="flex gap-4">
                            <Link
                                href="https://www.linkedin.com/in/openrize/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5 border border-white/5 hover:border-violet-500/50 group"
                            >
                                <Linkedin className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                            </Link>
                            <Link
                                href="https://www.instagram.com/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5 border border-white/5 hover:border-violet-500/50 group"
                            >
                                <Instagram className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h4 className="font-bold text-white mb-6 tracking-wide uppercase text-xs">Product</h4>
                            <ul className="space-y-4">
                                {[
                                    { label: "Features", href: "/features" },
                                    { label: "Pricing", href: "/pricing" },
                                    { label: "Integrations", href: "#" },
                                    { label: "API Docs", href: "#" },
                                    { label: "Changelog", href: "#" },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className="text-sm text-slate-500 hover:text-white transition-colors">{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 tracking-wide uppercase text-xs">Industry</h4>
                            <ul className="space-y-4 text-sm">
                                {[
                                    { label: "Motels & Hotels", href: "/review-management-for-restaurants" },
                                    { label: "Restaurants", href: "/review-management-for-restaurants" },
                                    { label: "Retail Stores", href: "/review-management-for-retail" },
                                    { label: "Medical Clinics", href: "/review-management-for-clinics" },
                                    { label: "Liquor Stores", href: "/review-management-for-liquor-stores" },
                                    { label: "Other Businesses", href: "#" },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="text-slate-500 hover:text-white transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 tracking-wide uppercase text-xs">Company</h4>
                            <ul className="space-y-4 text-sm">
                                {[
                                    { label: "About Us", href: "/about" },
                                    { label: "Contact", href: "/contact" },
                                    { label: "Privacy Policy", href: "/privacy-policy" },
                                    { label: "Terms & Conditions", href: "/terms-and-conditions" },
                                    { label: "Trust Center", href: "/trust-center" },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className="text-slate-500 hover:text-white transition-colors">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter signup inline */}
                <div className="flex flex-col md:flex-row items-center justify-between py-12 border-y border-white/5 gap-8 mb-12">
                    <div className="text-left">
                        <h4 className="text-xl font-bold text-white mb-1">Stay ahead of the curve</h4>
                        <p className="text-sm text-slate-500">Get the latest reputation management tips delivered directly to your inbox.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <input
                            type="email"
                            placeholder="you@company.com"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors w-full md:w-64"
                        />
                        <button className="btn-primary text-sm font-bold px-6 py-3 rounded-xl text-white">Subscribe</button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs font-medium uppercase tracking-[0.1em]">
                    <p>&copy; {new Date().getFullYear()} Openrize. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/trust-center" className="hover:text-white transition-colors">Trust Center</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
