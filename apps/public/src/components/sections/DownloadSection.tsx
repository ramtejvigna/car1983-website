import Image from "next/image";
import { QrCode } from "lucide-react";
import { StoreButton } from "@/components/ui/StoreButtons";

export function DownloadSection() {
  return (
    <section id="download" className="py-28 bg-black" aria-label="Download the app">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">

        {/* Ambient glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-[0.12] bg-[#795BFB] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative">

          <h2 className="text-5xl sm:text-7xl font-black text-white leading-[0.9] tracking-tight mb-5">
            Ready to ride?
          </h2>
          <p className="text-white/40 text-base max-w-sm mx-auto mb-12 leading-relaxed">
            Download Car 1983 and your first ride is on us. Available now on iOS and Android.
          </p>

          {/* Store buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-14">
            <StoreButton variant="apple" dark size="lg" />
            <StoreButton variant="google" dark size="lg" />
          </div>

          {/* QR codes */}
          <div className="flex flex-wrap gap-8 justify-center">
            {[
              { label: "iOS – App Store", sublabel: "Scan to download" },
              { label: "Android – Google Play", sublabel: "Scan to download" },
            ].map((q) => (
              <div key={q.label} className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-black" />
                </div>
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em]">
                  {q.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
