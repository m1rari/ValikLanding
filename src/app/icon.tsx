import { ImageResponse } from "next/og";

export const runtime = "edge";

/** Минимум 48×48 — рекомендация Google для фавиконки в поиске */
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F1117",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            background: "#F5A623",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
