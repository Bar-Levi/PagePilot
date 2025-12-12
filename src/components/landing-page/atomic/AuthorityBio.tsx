"use client";
import React from "react";

export interface AuthorityBioProps {
  imageSrc?: string;
  imageAlt?: string;
  name: string;
  title?: string;
  headline?: string;
  story: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  id?: string;
}

export const AuthorityBio: React.FC<AuthorityBioProps> = ({
  imageSrc,
  imageAlt,
  name,
  title,
  headline,
  story,
  accentColor = "#00D4AA",
  textColor = "#FFFFFF",
  backgroundColor = "transparent",
  id,
}) => {
  return (
    <div
      data-component-id={id}
      data-component-type="AuthorityBio"
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
      {/* Profile Image with Glow Effect */}
      {imageSrc && (
        <div
          style={{
            position: "relative",
            width: "200px",
            height: "200px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
              filter: "blur(8px)",
              opacity: 0.6,
            }}
          />
          <img
            src={imageSrc}
            alt={imageAlt || name}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              border: `4px solid ${accentColor}`,
            }}
          />
        </div>
      )}

      {/* Headline */}
      {headline && (
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 700,
            textAlign: "center",
            margin: 0,
            maxWidth: "900px",
            lineHeight: 1.3,
            background: `linear-gradient(135deg, ${textColor}, ${accentColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {headline}
        </h2>
      )}

      {/* Name & Title */}
      {(name || title) && (
        <div style={{ textAlign: "center" }}>
          {name && (
            <p
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: textColor,
                margin: 0,
              }}
            >
              {name}
            </p>
          )}
          {title && (
            <p
              style={{
                fontSize: "16px",
                color: `${textColor}99`,
                margin: "8px 0 0 0",
              }}
            >
              {title}
            </p>
          )}
        </div>
      )}

      {/* Story */}
      <div
        style={{
          maxWidth: "800px",
          fontSize: "18px",
          lineHeight: 1.8,
          color: `${textColor}CC`,
          textAlign: "center",
        }}
        dangerouslySetInnerHTML={{ __html: story }}
      />
    </div>
  );
};
