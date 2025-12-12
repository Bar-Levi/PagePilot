"use client";
import React from "react";
import { Check, Gift } from "lucide-react";

export interface ValueStackItem {
  title: string;
  description?: string;
  value?: string;
}

export interface ValueStackProps {
  headline?: string;
  subheadline?: string;
  items: ValueStackItem[];
  totalValue?: string;
  totalLabel?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  cardBackground?: string;
  ctaText?: string;
  ctaHref?: string;
  id?: string;
}

export const ValueStack: React.FC<ValueStackProps> = ({
  headline,
  subheadline,
  items = [],
  totalValue,
  totalLabel = "שווי כולל של הבונוסים:",
  accentColor = "#00D4AA",
  textColor = "#FFFFFF",
  backgroundColor = "transparent",
  cardBackground = "rgba(30, 41, 59, 0.5)",
  ctaText,
  ctaHref = "#contact",
  id,
}) => {
  return (
    <div
      data-component-id={id}
      data-component-type="ValueStack"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
        padding: "80px 24px",
        backgroundColor,
        direction: "rtl",
      }}
    >
      {/* Gift Icon */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: `${accentColor}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Gift size={32} color={accentColor} />
      </div>

      {/* Headlines */}
      <div style={{ textAlign: "center", maxWidth: "800px" }}>
        {headline && (
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              color: textColor,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {headline}
          </h2>
        )}
        {subheadline && (
          <p
            style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 600,
              color: accentColor,
              margin: "16px 0 0 0",
              lineHeight: 1.4,
            }}
          >
            {subheadline}
          </p>
        )}
      </div>

      {/* Value Items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              padding: "24px",
              background: cardBackground,
              borderRadius: "12px",
              border: `1px solid ${accentColor}20`,
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: `${accentColor}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              <Check size={16} color={accentColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: textColor,
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
                {item.value && (
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: accentColor,
                    }}
                  >
                    {item.value}
                  </span>
                )}
              </div>
              {item.description && (
                <p
                  style={{
                    fontSize: "15px",
                    color: `${textColor}99`,
                    margin: "8px 0 0 0",
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Total Value */}
      {totalValue && (
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: accentColor,
            textAlign: "center",
          }}
        >
          {totalLabel} {totalValue}
        </div>
      )}

      {/* CTA Button */}
      {ctaText && (
        <a
          href={ctaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "16px 40px",
            background: accentColor,
            color: "#0F172A",
            fontSize: "18px",
            fontWeight: 600,
            borderRadius: "12px",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          {ctaText}
        </a>
      )}
    </div>
  );
};
