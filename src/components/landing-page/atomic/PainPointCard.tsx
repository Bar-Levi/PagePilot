"use client";
import React from "react";
import { TrendingDown, Clock, DollarSign, AlertCircle, Frown, HelpCircle } from "lucide-react";

export interface PainPointCardProps {
  icon?: "trending-down" | "clock" | "dollar" | "alert" | "frown" | "question";
  title: string;
  description?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  id?: string;
}

const iconMap = {
  "trending-down": TrendingDown,
  "clock": Clock,
  "dollar": DollarSign,
  "alert": AlertCircle,
  "frown": Frown,
  "question": HelpCircle,
};

export const PainPointCard: React.FC<PainPointCardProps> = ({
  icon = "trending-down",
  title,
  description,
  accentColor = "#EF4444",
  textColor = "#FFFFFF",
  backgroundColor = "rgba(30, 41, 59, 0.6)",
  id,
}) => {
  const IconComponent = iconMap[icon] || TrendingDown;

  return (
    <div
      data-component-id={id}
      data-component-type="PainPointCard"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "40px 32px",
        background: backgroundColor,
        borderRadius: "16px",
        border: `1px solid ${accentColor}30`,
        direction: "rtl",
        textAlign: "center",
        minWidth: "280px",
        flex: "1",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: `${accentColor}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconComponent size={28} color={accentColor} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: accentColor,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: "15px",
            color: `${textColor}99`,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
