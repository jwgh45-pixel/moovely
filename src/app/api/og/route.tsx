import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getLocationById } from "@/data/locations";
import { compareLocations, formatCurrency } from "@/lib/calculations";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const fromId = searchParams.get("from");
  const toId = searchParams.get("to");

  if (!fromId || !toId) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0fdf4",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 800, color: "#14532d" }}>
            moovely
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#6b7c6b",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            the grass is greener
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const from = getLocationById(fromId);
  const to = getLocationById(toId);

  if (!from || !to) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0fdf4",
            fontSize: 40,
            color: "#14532d",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Comparison not found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const result = compareLocations(from, to);
  const amount = formatCurrency(Math.abs(result.totalAnnualDiff));
  const isGreener = result.verdict === "greener";
  const isWorse = result.verdict === "not-greener";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: isGreener
            ? "#f0fdf4"
            : isWorse
            ? "#fef2f2"
            : "#f9fafb",
          padding: "60px",
        }}
      >
        {/* Top bar - branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#14532d",
              }}
            >
              moovely
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#6b7c6b",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              the grass is greener
            </div>
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#6b7c6b",
            }}
          >
            moovely.co
          </div>
        </div>

        {/* City names */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 700, color: "#1a2e1a" }}>
            {from.name}
          </div>
          <div style={{ fontSize: 32, color: "#6b7c6b" }}>vs</div>
          <div style={{ fontSize: 42, fontWeight: 700, color: "#1a2e1a" }}>
            {to.name}
          </div>
        </div>

        {/* Headline number */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: isGreener
                ? "#16a34a"
                : isWorse
                ? "#dc2626"
                : "#374937",
              lineHeight: 1.1,
            }}
          >
            {isGreener
              ? `${amount}/year better off`
              : isWorse
              ? `${amount}/year worse off`
              : "About the same"}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#6b7c6b",
              marginTop: "16px",
            }}
          >
            {isGreener
              ? `in ${to.name}. The grass IS greener.`
              : isWorse
              ? `in ${to.name}. Maybe stay put.`
              : "This one's about lifestyle, not pounds."}
          </div>
        </div>

        {/* Bottom stats */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            borderTop: "2px solid",
            borderColor: isGreener
              ? "#bbf7d0"
              : isWorse
              ? "#fecaca"
              : "#e5e7eb",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 14, color: "#6b7c6b" }}>Median salary</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2e1a" }}>
              {formatCurrency(to.medianSalary)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 14, color: "#6b7c6b" }}>2-bed rent</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2e1a" }}>
              {formatCurrency(to.rentTwoBed)}/mo
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 14, color: "#6b7c6b" }}>Avg house price</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2e1a" }}>
              {formatCurrency(to.avgHousePrice)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 14, color: "#6b7c6b" }}>Pint of beer</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1a2e1a" }}>
              £{to.pintOfBeer.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
