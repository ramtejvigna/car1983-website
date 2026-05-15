import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Car 1983 – Premium Taxi & Ride Services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#CCFF33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={48}
            height={48}
            fill="none"
            stroke="#000"
            strokeWidth={1.5}
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
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          CAR 1983
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#CCFF33",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          PREMIUM TAXI & RIDE SERVICES
        </div>
      </div>
    ),
    size,
  );
}
