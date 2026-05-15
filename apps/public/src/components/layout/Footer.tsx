import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

const SOCIAL = [
  { label: "X", href: "#" },
  { label: "IG", href: "#" },
  { label: "FB", href: "#" },
  { label: "LI", href: "#" },
];

const NAV_COL = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Drive With Us", "/driver"],
  ["Contact", "/contact"],
];

const LEGAL_COL = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms & Conditions", "/terms"],
  ["Refund Policy", "/refund-policy"],
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-14">

          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center group mb-5" aria-label="Car 1983 home">
              <Image
                src="/logo-name.svg"
                alt="Car 1983"
                width={120}
                height={26}
                className="flex-shrink-0"
              />
            </Link>
            <p className="text-gray-700 text-sm leading-relaxed max-w-xs mb-7">
              Est. 1983. Premium ride-hailing for riders who expect more — now in your pocket.
            </p>
            <div className="flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 hover:border-[#795BFB] hover:text-[#795BFB] hover:bg-[#795BFB]/5 transition-all duration-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-5">
              Navigate
            </h3>
            <ul className="space-y-3">
              {NAV_COL.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-700 hover:text-[#795BFB] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {LEGAL_COL.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-700 hover:text-[#795BFB] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-5">
              Contact
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:support@car1983.com"
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-[#795BFB] transition-colors duration-200"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                support@car1983.com
              </a>
              <a
                href="tel:+18002271983"
                className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-[#795BFB] transition-colors duration-200"
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                1-800-CAR-1983
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year} Car 1983. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Trusted since 1983. Built for today.
          </p>
        </div>
      </div>
    </footer>
  );
}
