"use client";
import React from "react";
import { AlertTriangle, Clock, Info } from "lucide-react";

export interface AlertBannerProps {
  text: string;
  variant?: "warning" | "info" | "urgent";
  icon?: "warning" | "clock" | "info" | "none";
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  id?: string;
}

const iconMap = {
  warning: AlertTriangle,
  clock: Clock,
  info: Info,
  none: null,
};

const variantStyles = {
  warning: {
    bg: "rgba(220, 38, 38, 0.15)",
    border: "rgba(220, 38, 38, 0.4)",
    icon: "#DC2626",
  },
  info: {
    bg: "rgba(59, 130, 246, 0.15)",
    border: "rgba(59, 130, 246, 0.4)",
    icon: "#3B82F6",
  },
  urgent: {
    bg: "rgba(245, 158, 11, 0.15)",
    border: "rgba(245, 158, 11, 0.4)",
    icon: "#F59E0B",
  },
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  text,
  variant = "warning",
  icon = "warning",
  textColor = "#FFFFFF",
  backgroundColor,
  borderColor,
  id,
}) => {
  const styles = variantStyles[variant];
  const IconComponent = iconMap[icon];

  return (
    <div
      data-component-id={id}
      data-component-type="AlertBanner"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "16px 24px",
        background: backgroundColor || styles.bg,
        borderRadius: "12px",
        border: `1px solid ${borderColor || styles.border}`,
        direction: "rtl",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {IconComponent && (
        <IconComponent size={22} color={styles.icon} style={{ flexShrink: 0 }} />
      )}
      <p
        style={{
          fontSize: "16px",
          fontWeight: 500,
          color: textColor,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </div>
  );
};
