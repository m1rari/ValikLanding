import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Электромонтажные работы в Пинске — ИП Шугайло";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0D14",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Иконка + название */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              background: "#F59E0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
            }}
          >
            ⚡
          </div>
          <div
            style={{
              color: "#F59E0B",
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            ЭлектроМастер
          </div>
        </div>

        {/* Заголовок */}
        <div
          style={{
            color: "#FFFFFF",
            fontSize: "56px",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          Электромонтажные работы в Пинске
        </div>

        {/* Подзаголовок */}
        <div
          style={{
            color: "#94A3B8",
            fontSize: "28px",
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          ИП Шугайло В.Г. | Надёжно, по стандартам
        </div>

        {/* Разделитель */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "#F59E0B",
            borderRadius: "2px",
            marginBottom: "28px",
          }}
        />

        {/* Телефон */}
        <div
          style={{
            color: "#F59E0B",
            fontSize: "28px",
            fontWeight: 600,
          }}
        >
          +375 (29) 164-53-88
        </div>
      </div>
    ),
    { ...size }
  );
}
