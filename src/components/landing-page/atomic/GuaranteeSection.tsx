"use client";
import React from "react";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";

export interface GuaranteeSectionProps {
  headline?: string;
  content: string;
  warningText?: string;
  warningTitle?: string;
  ctaText?: string;
  ctaHref?: string;
  accentColor?: string;
  warningColor?: string;
  textColor?: string;
  backgroundColor?: string;
  id?: string;
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({
  headline,
  content,
  warningText,
  warningTitle = "חשוב לדעת:",
  ctaText,
  ctaHref = "#contact",
  accentColor = "#00D4AA",
  warningColor = "#DC2626",
  textColor = "#FFFFFF",
  backgroundColor = "transparent",
  id,
}) => {
  return (
    <div
      data-component-id={id}
      data-component-type="GuaranteeSection"
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
      {/* Shield Icon */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `${accentColor}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Shield size={40} color={accentColor} strokeWidth={1.5} />
      </div>

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
            lineHeight: 1.3,
          }}
        >
          {headline}
        </h2>
      )}

      {/* Content */}
      <div
        style={{
          maxWidth: "800px",
          fontSize: "18px",
          lineHeight: 1.8,
          color: `${textColor}CC`,
          textAlign: "center",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Warning Banner */}
      {warningText && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "20px 32px",
            background: `${warningColor}20`,
            borderRadius: "12px",
            border: `1px solid ${warningColor}40`,
            maxWidth: "700px",
            width: "100%",
          }}
        >
          <AlertTriangle size={24} color={warningColor} style={{ flexShrink: 0 }} />
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: warningColor,
                margin: 0,
              }}
            >
              {warningTitle}
            </p>
            <p
              style={{
                fontSize: "16px",
                color: textColor,
                margin: "4px 0 0 0",
                lineHeight: 1.5,
              }}
            >
              {warningText}
            </p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      {ctaText && (
        <a
          href={ctaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "18px 48px",
            background: accentColor,
            color: "#0F172A",
            fontSize: "18px",
            fontWeight: 600,
            borderRadius: "12px",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          <ArrowLeft size={20} />
          {ctaText}
        </a>
      )}
    </div>
  );
};
