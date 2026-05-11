import { ImageResponse } from "next/og";

export const runtime = "edge";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: "linear-gradient(135deg, #0B1220 0%, #111827 35%, #7F1D1D 100%)",
          color: "white",
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: "-0.03em",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.9, fontWeight: 600 }}>
          Global monitoring • RU/EN
        </div>
        <div style={{ marginTop: 18, lineHeight: 1.05 }}>Hantavirus Watch</div>
        <div
          style={{
            marginTop: 22,
            fontSize: 30,
            fontWeight: 600,
            opacity: 0.9,
            maxWidth: 980,
          }}
        >
          Live map signals, country risk context, and practical explainers.
        </div>
        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 12,
            alignItems: "center",
            fontSize: 22,
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#ef4444",
              boxShadow: "0 0 0 6px rgba(239, 68, 68, 0.15)",
            }}
          />
          Updated automatically
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
