function AppleSVG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlaySVG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
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

interface StoreButtonProps {
  variant: "apple" | "google";
  dark?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StoreButton({ variant, dark = true, size = "md" }: StoreButtonProps) {
  const pad = { sm: "px-4 py-2.5", md: "px-6 py-3.5", lg: "px-7 py-4" }[size];
  const iconCls = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }[size];
  const titleCls = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];
  const showLabel = size !== "sm";

  if (variant === "apple") {
    return (
      <a
        href="#"
        aria-label="Download on the App Store"
        className={`flex items-center gap-3 ${
          dark
            ? "bg-white text-black hover:bg-gray-100 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
            : "bg-black text-white hover:bg-gray-900"
        } ${pad} rounded-full font-bold hover:scale-[1.02] transition-all duration-300`}
      >
        <AppleSVG className={iconCls} />
        <div className="text-left leading-tight">
          {showLabel && <p className="text-[9px] opacity-50 uppercase tracking-wider mb-0.5">Download on</p>}
          <p className={`${titleCls} font-black`}>App Store</p>
        </div>
      </a>
    );
  }

  return (
    <a
      href="#"
      aria-label="Get it on Google Play"
      className={`flex items-center gap-3 ${
        dark
          ? "bg-white/8 text-white border border-white/15 hover:bg-white/12 hover:border-white/30"
          : "bg-white text-black border border-gray-200 hover:bg-gray-50"
      } ${pad} rounded-full font-bold hover:scale-[1.02] transition-all duration-300`}
    >
      <GooglePlaySVG className={iconCls} />
      <div className="text-left leading-tight">
        {showLabel && <p className="text-[9px] opacity-50 uppercase tracking-wider mb-0.5">Get it on</p>}
        <p className={`${titleCls} font-black`}>Google Play</p>
      </div>
    </a>
  );
}
