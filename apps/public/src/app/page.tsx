"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Car,
  MapPin,
  QrCode,
  Star,
  Shield,
  Zap,
  Heart,
  CheckCheck,
  CheckCircle,
  ArrowDownToLine,
  Menu,
  X,
  Clock,
  Navigation,
  MessageSquare,
  SlidersHorizontal,
  Plane,
  Building2,
  PartyPopper,
  ArrowRight,
  Phone,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Layers,
  Wifi,
  BadgeCheck,
} from "lucide-react";

// ─── Shared Download Button ───────────────────────────────────────────────────
function DownloadButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="#download"
      className={`inline-flex items-center bg-black text-white font-bold rounded-full cursor-pointer hover:opacity-90 transition-opacity ${className}`}
    >
      <span className="pl-7 pr-5 py-3 text-base tracking-tight whitespace-nowrap">
        Download Now
      </span>
      <span className="w-12 h-12 mr-1 rounded-full bg-[#CCFF33] flex items-center justify-center flex-shrink-0">
        <ArrowDownToLine className="w-5 h-5 text-black" />
      </span>
    </a>
  );
}

// ─── Apple Store SVG ──────────────────────────────────────────────────────────
function AppleSVG({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

// ─── Google Play SVG ─────────────────────────────────────────────────────────
function GooglePlaySVG({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path fill="#EA4335" d="M3.18.12L13.39 10.4l-2.97 2.97L3.18.12z" />
      <path fill="#4285F4" d="M3.18 23.88l7.24-13.25 2.97 2.97L3.18 23.88z" />
      <path fill="#34A853" d="M20.82 12L13.39 10.4l2.22 1.6-2.22 1.6L20.82 12z" />
      <path
        fill="#FBBC04"
        d="M3.18.12C2.84.3 2.6.69 2.6 1.15v21.7c0 .46.24.85.58 1.03L13.39 13.6 3.18.12z"
      />
    </svg>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Driver", href: "/driver" },
  { label: "Contact Us", href: "/contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8"
              fill="#CCFF33"
              stroke="black"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className="font-black text-xl tracking-widest text-black uppercase">
              Car 1983
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <DownloadButton />
            <button
              onClick={() => setOpen(!open)}
              className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {/* Drawer menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 space-y-1 shadow-lg">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="block px-3 py-3 text-base font-semibold text-gray-800 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-16 sm:pt-20 bg-white overflow-hidden">
      {/* Top: Heading + App Mockup */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-black leading-[0.88] tracking-tight mb-8">
              Car 1983 Taxi Services
            </h1>
            <p className="text-lg font-bold text-black mb-2">
              &ldquo;Your ride, your tier — always on time.&rdquo;
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Five vehicle tiers, real-time GPS matching, built-in SOS safety, and Stripe-secured payments — all in one app.
            </p>
          </div>

          {/* Right: Floating App UI Cards */}
          <div className="hidden lg:block relative h-[460px]">
            {/* Starburst background */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]"
              style={{
                background:
                  "repeating-conic-gradient(black 0deg 4deg, transparent 4deg 20deg)",
                borderRadius: "50%",
                width: "500px",
                height: "500px",
                margin: "auto",
              }}
            />
            {/* Main ride card — tier selector */}
            <div className="absolute right-0 top-0 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Choose your tier</p>
              <div className="space-y-2">
                {[
                  { tier: "ECONOMY", emoji: "🚗", eta: "3 min", price: "$7.50" },
                  { tier: "COMFORT",  emoji: "🚙", eta: "4 min", price: "$12.00" },
                  { tier: "XL",       emoji: "🚐", eta: "6 min", price: "$15.50" },
                  { tier: "LUXURY",   emoji: "🚘", eta: "8 min", price: "$26.00" },
                ].map((r, i) => (
                  <div
                    key={r.tier}
                    className={`flex items-center justify-between rounded-xl p-3 ${i === 1 ? "bg-[#CCFF33]" : "bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.emoji}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{r.tier}</p>
                        <p className="text-xs text-gray-500">{r.eta} away</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{r.price}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Driver card */}
            <div className="absolute left-0 top-1/4 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-base font-black text-amber-600">
                  W
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Willie Tanner</p>
                  <p className="text-xs text-amber-500">★ 4.8 (127 trips)</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <BadgeCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <p className="text-xs text-green-600 font-semibold">Verified Driver</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                  <p className="text-xs text-gray-600 truncate">220 Yonge St, Toronto</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full border border-black flex-shrink-0" />
                  <p className="text-xs text-gray-600 truncate">17600 Yonge St, Newmarket</p>
                </div>
              </div>
            </div>
            {/* SOS safety card */}
            <div className="absolute right-4 bottom-4 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">SOS Safety</p>
              <ul className="text-xs text-gray-500 space-y-0.5 mt-1">
                <li>• One-tap alert</li>
                <li>• Live GPS sent</li>
                <li>• 24/7 ops team</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Lime download section */}
      <div id="download" className="bg-[#CCFF33] py-14 px-5">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-10 items-center justify-center">
          {/* App Store */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center p-4 shadow-md">
              <QrCode className="w-full h-full text-black" />
            </div>
            <a
              href="#"
              className="flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <AppleSVG className="w-6 h-6 fill-white shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Download on</p>
                <p className="text-sm font-bold">App Store</p>
              </div>
            </a>
          </div>
          {/* Google Play */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center p-4 shadow-md">
              <QrCode className="w-full h-full text-black" />
            </div>
            <a
              href="#"
              className="flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <GooglePlaySVG className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Get it on</p>
                <p className="text-sm font-bold">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Discover Section ─────────────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    bg: "#FFE89C",
    icon: AlertTriangle,
    title: "Built-in SOS Safety",
    desc: "One-tap PANIC or SILENT SOS alert with live GPS location sent to emergency contacts and our ops team — for riders and drivers.",
  },
  {
    bg: "#C5C3F2",
    icon: Zap,
    title: "Smart Real-Time Matching",
    desc: "H3-based geospatial matching finds the nearest verified driver in seconds, with live traffic-aware ETA before you confirm.",
  },
  {
    bg: "#B8F0D8",
    icon: Layers,
    title: "5 Vehicle Tiers",
    desc: "Choose from Economy, Comfort, XL, Luxury, or Moto — each tier priced transparently with no surge surprises.",
  },
];

const TRANSPORT_CHECKS = [
  {
    title: "Verified Professional Drivers",
    desc: "Every driver completes a rigorous onboarding process — document verification, vehicle inspection, and background checks — before they can accept a single ride.",
  },
  {
    title: "Traffic-Aware ETA & Routing",
    desc: "Our real-time routing engine factors live traffic conditions into every ETA, so the time you see when booking is the time you'll actually wait.",
  },
];

const EXCEPTIONAL_SERVICES = [
  { icon: Plane, label: "Airport Transfers: Scheduled pickups that track your flight." },
  { icon: Building2, label: "Corporate Travel: Expense-friendly rides for meetings and events." },
  { icon: CreditCard, label: "Cashless Payments: Stripe-secured cards, stored securely in-app." },
  { icon: PartyPopper, label: "Special Events: XL & Luxury tiers for celebrations and groups." },
];

function Discover() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="text-5xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4">
          Discover Smarter Rides
          <br />
          with a Tap
        </h2>
        <p className="text-lg text-gray-500 mb-16">
          Real-time matching, verified drivers, and five tiers of vehicles — all in one app.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {FEATURE_CARDS.map((c) => (
            <div key={c.title} className="rounded-3xl p-8" style={{ backgroundColor: c.bg }}>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                <c.icon className="w-7 h-7 text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mb-4">{c.title}</h3>
              <p className="text-gray-700 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Transportation Solutions */}
          <div>
            <h3 className="text-4xl font-black text-black leading-tight mb-8">
              Transportation Solutions
            </h3>
            <div className="space-y-8">
              {TRANSPORT_CHECKS.map((t) => (
                <div key={t.title}>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCheck className="w-5 h-5 text-black flex-shrink-0" />
                    <p className="font-black text-black text-lg">{t.title}</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed pl-8">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exceptional Services */}
          <div>
            <h3 className="text-4xl font-black text-black leading-tight mb-4">
              Built for Every Kind of Journey
            </h3>
            <p className="text-gray-500 mb-6">
              Whether it&apos;s a quick commute or a black-car airport run, Car 1983 has the right tier.
            </p>
            <div className="space-y-4 mb-8">
              {EXCEPTIONAL_SERVICES.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{s.label}</span>
                </div>
              ))}
            </div>
            {/* App stats mini-grid */}
            <div className="rounded-3xl bg-gray-50 border border-gray-100 p-6 grid grid-cols-2 gap-4">
              {[
                { label: "Vehicle Tiers", value: "5" },
                { label: "States Covered", value: "4" },
                { label: "Avg. Match Time", value: "<30s" },
                { label: "SOS Response", value: "24/7" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-black">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── App Features ─────────────────────────────────────────────────────────────
const APP_FEATURES = [
  {
    icon: AlertTriangle,
    title: "SOS Emergency Button",
    desc: "Tap once for a PANIC or SILENT alert. Your GPS location and trip details go to your emergency contacts and our 24/7 operations team instantly.",
  },
  {
    icon: Zap,
    title: "Instant Smart Matching",
    desc: "Our geospatial engine matches you with the nearest available driver in your chosen tier in seconds — no waiting, no guessing.",
  },
  {
    icon: Navigation,
    title: "Real-Time GPS Tracking",
    desc: "Watch your driver approach on a live map. Share your trip link with friends and family so they always know where you are.",
  },
  {
    icon: MessageSquare,
    title: "In-App Trip Updates",
    desc: "Push notifications, SMS, and email keep you informed at every step — driver accepted, arrived, trip started, and completed.",
  },
  {
    icon: CreditCard,
    title: "Saved Payment Methods",
    desc: "Store up to 5 Stripe-secured cards, set a default, and pay in one tap. Every transaction is encrypted end-to-end.",
  },
  {
    icon: BadgeCheck,
    title: "Dispute & Rating System",
    desc: "Rate your driver after every trip and file a dispute in-app if something goes wrong. Our ops team reviews and resolves within 24 hours.",
  },
];

function AppFeatures() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="text-5xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4">
          Experience Seamless Transportation with Our Car 1983 App.
        </h2>
        <div className="mb-16">
          <DownloadButton />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10">
          {APP_FEATURES.map((f) => (
            <div key={f.title} className="flex gap-5">
              <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="font-black text-black text-lg mb-1">{f.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Vehicle Tiers ────────────────────────────────────────────────────────────
const VEHICLE_TIERS = [
  {
    tier: "MOTO",
    emoji: "🛵",
    bg: "#F3F4F6",
    badge: "Fastest",
    badgeBg: "#CCFF33",
    desc: "Beat traffic on a motorcycle. Best for solo riders covering short distances.",
    from: "$4",
  },
  {
    tier: "ECONOMY",
    emoji: "🚗",
    bg: "#EFF6FF",
    badge: "Best Value",
    badgeBg: "#BFDBFE",
    desc: "Everyday sedans and hatchbacks. Clean, reliable, and easy on your wallet.",
    from: "$7",
  },
  {
    tier: "COMFORT",
    emoji: "🚙",
    bg: "#F0FDF4",
    badge: "Popular",
    badgeBg: "#BBF7D0",
    desc: "Newer cars with extra legroom. Ideal for airport runs or a longer commute.",
    from: "$11",
  },
  {
    tier: "XL",
    emoji: "🚐",
    bg: "#FFF7ED",
    badge: "Groups",
    badgeBg: "#FED7AA",
    desc: "SUVs and minivans seating up to 6. Perfect for families or group outings.",
    from: "$15",
  },
  {
    tier: "LUXURY",
    emoji: "🚘",
    bg: "#FDF4FF",
    badge: "Premium",
    badgeBg: "#E9D5FF",
    desc: "Top-tier sedans and SUVs with professional chauffeurs for special occasions.",
    from: "$25",
  },
];

function VehicleTiers() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-4">
          Five Tiers. One App.
        </h2>
        <p className="text-gray-400 text-lg mb-14 max-w-xl">
          From a quick moto zip to a luxury SUV — every tier is priced clearly upfront with no hidden fees.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {VEHICLE_TIERS.map((v) => (
            <div
              key={v.tier}
              className="rounded-3xl p-6 flex flex-col gap-3"
              style={{ backgroundColor: v.bg }}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">{v.emoji}</span>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: v.badgeBg, color: "#000" }}
                >
                  {v.badge}
                </span>
              </div>
              <p className="font-black text-black text-xl tracking-tight">{v.tier}</p>
              <p className="text-gray-600 text-xs leading-relaxed flex-1">{v.desc}</p>
              <p className="text-black font-black text-lg">
                from {v.from}
                <span className="text-gray-500 font-normal text-sm"> / ride</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "The app provides an excellent and reliable transportation service. Whether I'm booking a ride to the airport or a quick trip across town, I always feel confident knowing my ride will be on time and comfortable. Highly recommend!",
    name: "Kiran Kumar",
    role: "Frequent Traveler",
  },
  {
    quote:
      "Car 1983 has transformed my daily commute. The drivers are professional, the vehicles are spotless, and the app is incredibly intuitive. Best ride service I've ever used — I won't go back to anything else.",
    name: "Sarah Mitchell",
    role: "Corporate Professional",
  },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];

  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <h2 className="text-4xl font-black text-white mb-14">
          Customer Experiences with Our Car 1983 App
        </h2>
        <div className="grid md:grid-cols-[220px_1fr] gap-12 items-start">
          {/* Avatar placeholder */}
          <div className="w-52 h-64 rounded-3xl bg-gray-900 border border-gray-800 flex flex-col items-center justify-center gap-3 mx-auto md:mx-0">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-3xl font-black text-gray-300">{t.name[0]}</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-200">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          </div>
          {/* Quote */}
          <div>
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-[#CCFF33] text-[#CCFF33]" />
              ))}
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed mb-8">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="font-bold text-white">{t.name}</p>
            <p className="text-gray-500 text-sm">{t.role}</p>
            {/* Controls */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setActive((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-10 h-10 rounded-full border border-gray-600 hover:border-[#CCFF33] hover:text-[#CCFF33] flex items-center justify-center transition-colors text-sm"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                onClick={() => setActive((active + 1) % TESTIMONIALS.length)}
                className="w-10 h-10 rounded-full border border-gray-600 hover:border-[#CCFF33] hover:text-[#CCFF33] flex items-center justify-center transition-colors text-sm"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    title: "7 Tips for a Seamless Airport Transfer Experience",
    href: "/blog/airport-transfers",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "Essential Features for Corporate Travel Apps",
    href: "/blog/corporate-travel",
    gradient: "from-teal-400 to-cyan-600",
  },
  {
    title: "Transforming Leisure Travel with Ride-Sharing Apps",
    href: "/blog/leisure-travel",
    gradient: "from-violet-400 to-indigo-600",
  },
];

function Blog() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <h2 className="text-4xl font-black text-black mb-2">
          Explore Our Latest Insights and Updates on Transportation
        </h2>
        <p className="text-gray-500 mb-12">Stay up to date with ride services, tips, and news.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((p) => (
            <div
              key={p.title}
              className="bg-gray-50 rounded-3xl overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div
                className={`h-48 bg-gradient-to-br ${p.gradient} flex items-center justify-center`}
              >
                <Car className="w-16 h-16 text-white/50" />
              </div>
              <div className="p-6">
                <h3 className="font-black text-black text-lg leading-snug mb-5 group-hover:underline decoration-2">
                  {p.title}
                </h3>
                <a
                  href={p.href}
                  className="inline-flex items-center gap-2 font-bold text-black text-sm hover:gap-3 transition-all"
                >
                  Learn more
                  <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 bg-[#CCFF33]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <h2 className="text-5xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-6">
          Start your ride with our app today!
        </h2>
        <p className="text-gray-700 text-lg mb-10 max-w-lg">
          Book your rides, track your trips, and manage payments — all from one intuitive app.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#"
            className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            <AppleSVG className="w-6 h-6 fill-white shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Download on the</p>
              <p className="text-sm font-bold">App Store</p>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            <GooglePlaySVG className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Get it on</p>
              <p className="text-sm font-bold">Google Play</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8"
                fill="#CCFF33"
                stroke="black"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span className="font-black text-xl tracking-widest uppercase">Car 1983</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Book your ride, track your journey, and manage payments easily.
            </p>
            <div className="flex gap-3">
              {["f", "▶", "◎", "𝕏", "in"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center text-xs font-bold text-gray-600 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-black text-black mb-4">Sections</h4>
            <ul className="space-y-3">
              {[
                ["Home", "/"],
                ["About us", "/about"],
                ["Driver", "/driver"],
                ["Contact us", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-black text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="font-black text-black mb-4">Policy</h4>
            <ul className="space-y-3">
              {[
                ["Refund Policy", "/refund-policy"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms & Conditions", "/terms"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-black text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-black mb-4">Contact Us</h4>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <a
                href="mailto:support@car1983.com"
                className="text-gray-500 hover:text-black text-sm transition-colors"
              >
                support@car1983.com
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {year} All rights reserved{" "}
            <Link href="/" className="text-black font-semibold hover:underline">
              Car 1983.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Discover />
        <AppFeatures />        <VehicleTiers />        <Testimonials />
        <Blog />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
