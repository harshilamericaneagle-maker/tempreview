"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Star, ChevronDown } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Why Us", href: "/why-us" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(8, 11, 20, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="ReviewHub Logo" className="w-8 h-8 object-contain" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #f8faff, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ReviewManagement
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-all duration-200 relative group"
                style={{ color: "rgba(203, 213, 225, 0.8)" }}
              >
                <span className="group-hover:text-white transition-colors">{link.name}</span>
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: "linear-gradient(90deg, #6366f1, #06b6d4)" }}
                />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: "rgba(203, 213, 225, 0.8)" }}
            >
              Sign In
            </Link>
            <Link href="/dashboard">
              <button className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-xl text-white cursor-pointer">
                Start Free Trial →
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "rgba(203, 213, 225, 0.8)" }}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "rgba(8, 11, 20, 0.98)",
            borderColor: "rgba(99, 102, 241, 0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="px-6 py-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-3 text-sm font-medium border-b transition-colors"
                style={{
                  color: "rgba(203, 213, 225, 0.8)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <button className="btn-primary w-full text-sm font-semibold py-3 rounded-xl text-white">
                  Start Free Trial →
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
