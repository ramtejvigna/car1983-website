'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pin {
  id: string;
  driver: string;
  rider: string;
  vehicle: string;
  fare: string;
  eta: string;
  lat: number;
  lng: number;
}

// ─── Data — New York City ─────────────────────────────────────────────────────

const PINS: Pin[] = [
  { id: 'RD-001', driver: 'Mike Chen',  rider: 'Sarah Johnson',  vehicle: 'SUV',     fare: '$24.50', eta: '8 min',  lat: 40.7589, lng: -73.9851 },
  { id: 'RD-005', driver: 'David Kim',  rider: 'Jessica Taylor', vehicle: 'SUV',     fare: '$45.00', eta: '14 min', lat: 40.7282, lng: -73.9942 },
  { id: 'RD-018', driver: 'Priya Shah', rider: 'Noah Reed',      vehicle: 'Sedan',   fare: '$21.80', eta: '5 min',  lat: 40.7484, lng: -73.9967 },
  { id: 'RD-024', driver: 'Omar Ali',   rider: 'Mia Clarke',     vehicle: 'Premium', fare: '$38.20', eta: '11 min', lat: 40.7614, lng: -73.9776 },
];

const MAP_CENTER: [number, number] = [40.7450, -73.9880];

// Raw SVG string for the DivIcon — React components cannot be used inside Leaflet HTML strings
const CAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14l-1.6-5.4A3 3 0 0 0 14.5 9h-5a3 3 0 0 0-2.9 2.6L5 17Z"/><path d="M6 17v2"/><path d="M18 17v2"/><circle cx="8" cy="17" r="1.8"/><circle cx="16" cy="17" r="1.8"/></svg>`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActiveRidesMap() {
  // Memoize icon so it isn't recreated on every render
  const pinIcon = useMemo(
    () =>
      L.divIcon({
        html: `<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center">
          <span style="position:absolute;inset:0;border-radius:50%;background:rgba(124,58,237,0.18);animation:ridepin-pulse 1.8s ease-out infinite"></span>
          <span style="position:relative;width:44px;height:44px;border-radius:50%;background:#7c3aed;border:3px solid #fff;box-shadow:0 4px 14px rgba(109,40,217,0.4);display:inline-flex;align-items:center;justify-content:center">${CAR_SVG}</span>
        </div>`,
        className: '',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -28],
      }),
    [],
  );

  return (
    <article className="bg-white rounded-2xl border border-[#e8e9f0] overflow-hidden xl:col-span-2">
      {/* Header */}
      <div className="px-7 py-6 border-b border-[#e6e8ef]">
        <div className="flex items-center gap-3">
          <svg
            className="size-7 text-violet-500"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M12 22s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
            <circle cx="12" cy="11" r="2" />
          </svg>
          <h2 className="text-2xl font-extrabold tracking-tight m-0">Active Ride Map</h2>
        </div>
        <p className="text-[17px] text-[#6d7385] mt-3 m-0">
          Live locations for rides currently in progress
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ── Map ── */}
        <div className="relative">
          <MapContainer
            center={MAP_CENTER}
            zoom={13}
            zoomControl={false}
            scrollWheelZoom
            style={{ height: 430 }}
            className="w-full"
          >
            {/* CartoDB Positron — clean light tile set, no API key required */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={20}
            />

            {/* Zoom controls — bottom-right so they don't clash with the overlay */}
            <ZoomControl position="bottomright" />

            {PINS.map((pin) => (
              <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon}>
                <Popup minWidth={190}>
                  <div>
                    <p className="font-mono text-xs font-bold text-violet-500 m-0">{pin.id}</p>
                    <h3 className="mt-1.5 text-base font-extrabold text-[#202838] m-0">{pin.driver}</h3>
                    <p className="mt-1 text-sm text-[#6d7385] m-0">
                      {pin.rider} &middot; {pin.vehicle}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#202838]">{pin.fare}</span>
                      <span className="rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-xs font-extrabold text-sky-600">
                        ETA {pin.eta}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* "Active now" counter overlay */}
          <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm pointer-events-none">
            <p className="text-sm font-bold text-[#6d7385] m-0">Active now</p>
            <p className="text-3xl font-extrabold text-[#202838] tracking-tight m-0">{PINS.length}</p>
          </div>
        </div>

        {/* ── Ride list sidebar ── */}
        <div className="border-t lg:border-l lg:border-t-0 border-[#e6e8ef] divide-y divide-[#e6e8ef] overflow-y-auto h-[430px]">
          {PINS.map((ride) => (
            <div key={ride.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold text-violet-500 m-0">{ride.id}</p>
                  <h3 className="mt-2 text-lg font-extrabold text-[#202838] truncate m-0">{ride.driver}</h3>
                </div>
                <span className="shrink-0 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm font-extrabold text-sky-600">
                  {ride.eta}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#6d7385] m-0">
                {ride.rider} &middot; {ride.vehicle} &middot; {ride.fare}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
