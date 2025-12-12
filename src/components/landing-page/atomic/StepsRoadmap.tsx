"use client";
import React from "react";
import { TrendingUp, Shield, Target, Rocket, CheckCircle, Award } from "lucide-react";

export interface RoadmapStep {
  number?: number;
  title: string;
  description?: string;
  icon?: "trending-up" | "shield" | "target" | "rocket" | "check" | "award";
}

export interface StepsRoadmapProps {
  headline?: string;
  subheadline?: string;
  steps: RoadmapStep[];
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  cardBackground?: string;
  id?: string;
}

const iconMap = {
  "trending-up": TrendingUp,
  "shield": Shield,
  "target": Target,
  "rocket": Rocket,
  "check": CheckCircle,
  "award": Award,
};

export const StepsRoadmap: React.FC<StepsRoadmapProps> = ({
  headline,
  subheadline,
  steps = [],
  accentColor = "#00D4AA",
  textColor = "#FFFFFF",
  backgroundColor = "transparent",
  cardBackground = "rgba(30, 41, 59, 0.6)",
  id,
}) => {
  return (
    <div
      data-component-id={id}
      data-component-type="StepsRoadmap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "48px",
        padding: "80px 24px",
        backgroundColor,
        direction: "rtl",
      }}
    >
      {/* Headlines */}
      <div style={{ textAlign: "center", maxWidth: "800px" }}>
        {headline && (
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 40px)",
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
              fontSize: "18px",
              color: `${textColor}99`,
              margin: "16px 0 0 0",
              lineHeight: 1.6,
            }}
          >
            {subheadline}
          </p>
        )}
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        {steps.map((step, index) => {
          const IconComponent = step.icon ? iconMap[step.icon] : null;
          const stepNumber = step.number ?? index + 1;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
                padding: "32px",
                background: cardBackground,
                borderRadius: "16px",
                border: `1px solid ${accentColor}20`,
                position: "relative",
              }}
            >
              {/* Icon or Number */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0F172A",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                {IconComponent ? <IconComponent size={28} /> : stepNumber}
              </div>

              {/* Content */}
              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: textColor,
                    margin: 0,
                  }}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p
                    style={{
                      fontSize: "16px",
                      color: `${textColor}99`,
                      margin: "12px 0 0 0",
                      lineHeight: 1.6,
                    }}
                  >
                    {step.description}
                  </p>
                )}
              </div>

              {/* Connector line to next step */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "24px",
                    background: `linear-gradient(to bottom, ${accentColor}60, transparent)`,
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
