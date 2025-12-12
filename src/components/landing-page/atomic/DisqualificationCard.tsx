"use client";
import React from "react";
import { X } from "lucide-react";

export interface DisqualificationCardProps {
  headline?: string;
  description?: string;
  items: string[];
  closingStatement?: string;
  closingColor?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  cardBackground?: string;
  id?: string;
}

export const DisqualificationCard: React.FC<DisqualificationCardProps> = ({
  headline,
  description,
  items = [],
  closingStatement,
  closingColor = "#EF4444",
  accentColor = "#EF4444",
  textColor = "#FFFFFF",
  backgroundColor = "transparent",
  cardBackground = "rgba(30, 41, 59, 0.8)",
  id,
}) => {
  return (
    <div
      data-component-id={id}
      data-component-type="DisqualificationCard"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        padding: "80px 24px",
        backgroundColor,
        direction: "rtl",
      }}
    >
      {/* Headline */}
      {headline && (
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 700,
            textAlign: "center",
            color: textColor,
            margin: 0,
            maxWidth: "900px",
          }}
        >
          {headline.split(" ").map((word, i) => (
            <span
              key={i}
              style={{
                color: word === "לא" || word === "מתאים?" ? accentColor : textColor,
              }}
            >
              {word}{" "}
            </span>
          ))}
        </h2>
      )}

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: "18px",
            color: `${textColor}CC`,
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {description}
        </p>
      )}

      {/* Card with Items */}
      <div
        style={{
          background: cardBackground,
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "700px",
          width: "100%",
          border: `1px solid ${accentColor}30`,
        }}
      >
        {/* Card Header */}
        <p
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: accentColor,
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          אם אתה:
        </p>

        {/* Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: `${accentColor}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <X size={14} color={accentColor} />
              </div>
              <span
                style={{
                  fontSize: "16px",
                  color: `${textColor}CC`,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Closing Statement */}
        {closingStatement && (
          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: `1px solid ${textColor}20`,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: `${textColor}99`,
                margin: "0 0 8px 0",
              }}
            >
              אז אני אומר את זה בכנות מלאה:
            </p>
            <p
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: closingColor,
                margin: 0,
              }}
            >
              {closingStatement}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
