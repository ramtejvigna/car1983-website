"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Drive", href: "/driver" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-xl border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center group" aria-label="Car 1983 home">
            <Image
              src="/logo-name.svg"
              alt="Car 1983"
              width={96}
              height={21}
              className="brightness-0 invert flex-shrink-0"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="relative px-4 py-2 text-sm font-semibold text-white/55 hover:text-white transition-colors duration-200 group"
              >
                {l.label}
                <span className="absolute bottom-0 left-4 right-4 h-px bg-[#795BFB] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="#download"
              className="hidden sm:inline-flex items-center gap-2 bg-[#795BFB] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#6849ea] hover:shadow-[0_0_24px_rgba(121,91,251,0.45)] transition-all duration-300"
            >
              Get the App
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:border-[#795BFB]/60 hover:bg-[#795BFB]/10 transition-all duration-300"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span
                className="transition-transform duration-300"
                style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer — animated slide-down */}
      <div
        className="md:hidden overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: open ? "360px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="bg-black/97 backdrop-blur-xl border-t border-white/8 px-5 py-4">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              className="block py-3.5 text-sm font-semibold text-white/55 hover:text-white border-b border-white/5 last:border-0 transition-colors duration-200"
              onClick={() => setOpen(false)}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0)" : "translateX(-8px)",
                transition: `opacity 0.3s ease ${i * 60 + 80}ms, transform 0.3s ease ${i * 60 + 80}ms`,
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#download"
            className="mt-5 block w-full text-center bg-[#795BFB] text-white font-bold py-3.5 rounded-full hover:bg-[#6849ea] transition-colors duration-300"
            onClick={() => setOpen(false)}
          >
            Get the App
          </a>
        </div>
      </div>
    </header>
  );
}
