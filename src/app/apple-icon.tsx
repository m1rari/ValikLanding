import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            width: 105,
            height: 105,
            borderRadius: 52,
            background: "#F5A623",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
