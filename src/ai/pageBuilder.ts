structure: StructureOutput;
copy: CopyOutput;
design: DesignOutput;
}

export function buildPageJson({
  input,
  strategy,
  structure,
  copy,
  design,
}: BuildPageJsonInput): PageComponent {
  const sections: PageComponent[] = [];

  console.log(
    "🔨 Building page from structure:",
    JSON.stringify(structure, null, 2)
  );
  console.log(
    "📋 Available copy sections:",
    Object.keys(copy.sectionsCopy || {})
  );
  console.log(
    "🎨 Available design hints:",
    Object.keys(design.layoutHints || {})
  );

  for (const section of structure.sections) {
    const sectionCopy = copy.sectionsCopy?.[section.id] || {};
    const layoutHint = design.layoutHints?.[section.id];

    console.log(`📦 Building section ${section.id}:`, {
      hasCopy: Object.keys(sectionCopy).length > 0,
      copyKeys: Object.keys(sectionCopy),
      hasLayoutHint: !!layoutHint,
      sectionCopy: sectionCopy,
    });

    // If no copy was generated, create a fallback with basic content
    // Check if sectionCopy has any meaningful content (not just undefined/empty values)
    const hasContent =
      sectionCopy.heading ||
      sectionCopy.subheading ||
      sectionCopy.paragraph ||
      (sectionCopy.bullets && sectionCopy.bullets.length > 0) ||
      (sectionCopy.faqItems && sectionCopy.faqItems.length > 0) ||
      (sectionCopy.testimonials && sectionCopy.testimonials.length > 0) ||
      sectionCopy.ctaLabelPrimary ||
      sectionCopy.ctaLabelSecondary;

    // Create better fallback content based on section type and strategy
    const finalSectionCopy = hasContent
      ? sectionCopy
      : (() => {
        switch (section.type) {
          case "hero":
            return {
              heading: `${strategy.refinedValueProp ||
                `ברוכים הבאים ל-${input.businessName}`
                }`,
              subheading: strategy.primaryPromise || `הפתרון המושלם עבורך`,
              paragraph: `אנו ב-${input.businessName} מתמחים ב-${input.businessType
                }. ${strategy.keyBenefitsToHighlight[0] ||
                "אנו כאן כדי לעזור לך להשיג את המטרות שלך."
                }`,
              ctaLabelPrimary: strategy.mainCTA || "התחל עכשיו",
              ctaLabelSecondary: "למד עוד",
            };
          case "problem":
            return {
              heading: "האם אתה מזהה את הבעיות האלה?",
              subheading: "אנחנו מבינים את האתגרים שלך",
              paragraph:
                strategy.keyPainsToHighlight.length > 0
                  ? `צעירים רבים מתמודדים עם: ${strategy.keyPainsToHighlight
                    .slice(0, 3)
                    .join(
                      ", "
                    )}. זה יכול להיות מתסכל ומעכב אותך מלהשיג את המטרות שלך.`
                  : `אנחנו מבינים את האתגרים שאתה מתמודד איתם.`,
              bullets: strategy.keyPainsToHighlight.slice(0, 4),
            };
          case "solution":
            return {
              heading: "הפתרון שלך נמצא כאן",
              subheading: strategy.primaryPromise || "אנחנו כאן כדי לעזור",
              paragraph: `${input.businessName
                } מציעה פתרון מקיף שיעזור לך להתגבר על האתגרים ולהשיג את המטרות שלך. ${strategy.keyBenefitsToHighlight[0] || ""
                }`,
              ctaLabelPrimary: "גלה איך",
            };
          case "benefits":
            return {
              heading: "למה לבחור בנו?",
              subheading: "היתרונות שלנו",
              bullets:
                strategy.keyBenefitsToHighlight.length > 0
                  ? strategy.keyBenefitsToHighlight
                  : ["יתרון 1", "יתרון 2", "יתרון 3"],
            };
          case "socialProof":
            return {
              heading: "מה הלקוחות שלנו אומרים",
              subheading: "הצטרף לאלפי לקוחות מרוצים",
              testimonials: [
                {
                  name: "לקוח מרוצה",
                  role: "משתמש בשירות",
                  quote: `${input.businessName} שינתה את החיים שלי. עכשיו אני מרגיש ביטחון פיננסי כמו שלא הרגשתי קודם.`,
                },
              ],
            };
          case "offer":
            return {
              heading: input.specialOffer || "הצעה מיוחדת עבורך",
              subheading: "אל תפספס את ההזדמנות",
              paragraph:
                input.specialOffer ||
                `קבל גישה מיוחדת לשירותים שלנו. ${strategy.mainCTA}`,
              ctaLabelPrimary: strategy.mainCTA || "התחל עכשיו",
            };
          case "faq":
            return {
              heading: "שאלות נפוצות",
              subheading: "כל מה שרצית לדעת",
              faqItems: [
                {
                  question: "איך זה עובד?",
                  answer: `${input.businessName} מציעה שירות מקיף שיעזור לך להשיג את המטרות שלך. התהליך פשוט וברור.`,
                },
                {
                  question: "כמה זה עולה?",
                  answer:
                    "אנחנו מציעים מחירים הוגנים ומותאמים אישית. צור קשר כדי לקבל הצעת מחיר מותאמת.",
                },
                {
                  question: "כמה זמן זה לוקח?",
                  answer:
                    "התהליך תלוי בצרכים שלך, אבל אנחנו עובדים בצורה יעילה כדי להביא תוצאות מהר ככל האפשר.",
                },
              ],
            };
          case "cta":
            return {
              heading: "מוכן להתחיל?",
              subheading: "הצטרף אלינו עוד היום",
              paragraph: `אל תחכה עוד. ${strategy.primaryPromise || "התחל את המסע שלך עכשיו."
                }`,
              ctaLabelPrimary: strategy.mainCTA || "התחל עכשיו",
              ctaLabelSecondary: "צור קשר",
            };
          default:
            return {
              heading: section.purpose || `סקשן ${section.type}`,
              paragraph: `זהו סקשן ${section.type} עבור ${input.businessName}`,
            };
        }
      })();

    console.log(`✅ Final section copy for ${section.id}:`, finalSectionCopy);

    const sectionComponent = buildSectionComponent({
      const children: PageComponent[] = [];
      const timestamp = Date.now();

      console.log(
        `🔧 Building section component for ${section.id} with copy:`,
        sectionCopy
      );

      // Add image for certain sections (hero, benefits, socialProof)
      const shouldAddImage =
        section.type === "hero" ||
        section.type === "benefits" ||
        section.type === "socialProof";
      if(shouldAddImage) {
        // Use Unsplash with relevant keywords based on section type and business type
        const imageKeywords =
          section.type === "hero"
            ? "business,professional,success,finance"
            : section.type === "benefits"
              ? "growth,achievement,success,finance"
              : "team,people,community,finance";

        // Use source.unsplash.com (now configured in next.config.ts)
        const imageUrl = `https://source.unsplash.com/800x600/?${imageKeywords}`;

        children.push({
          id: `${section.id}-image-${timestamp}`,
          type: "Image",
          props: {
            src: imageUrl,
            alt: `${businessName} - ${section.type}`,
            alignment: "center" as const,
            width: section.type === "hero" ? "100%" : 600,
            maxWidth: section.type === "hero" ? "100%" : 600,
            rounded: "12px",
          },
        });
      }

  // Determine text color based on section type and background
  const isDarkBackground =
        section.type === "hero" && layoutHint?.showBackgroundAccent;
      const isCTADark = section.type === "cta";
      const textColor = isDarkBackground || isCTADark ? "#ffffff" : "#1e293b";
      const subheadingColor =
        isDarkBackground || isCTADark ? "rgba(255,255,255,0.9)" : "#64748b";

      // Add heading
      if(sectionCopy.heading) {
        children.push({
          id: `${section.id}-heading-${timestamp}`,
          type: "RichText",
          props: {
            html: `<span style="font-size: ${layoutHint?.emphasisLevel === "high" || section.type === "hero"
              ? "48"
              : "36"
              }px; font-weight: 700; color: ${textColor};">${sectionCopy.heading
              }</span>`,
            align: "center",
          },
        });
  }

  // Add subheading
  if (sectionCopy.subheading) {
    children.push({
      id: `${section.id}-subheading-${timestamp}`,
      type: "RichText",
      props: {
        html: `<span style="font-size: 20px; color: ${subheadingColor};">${sectionCopy.subheading}</span>`,
        align: "center",
      },
    });
  }

  // Add paragraph
  if (sectionCopy.paragraph) {
    children.push({
      id: `${section.id}-paragraph-${timestamp}`,
      type: "RichText",
      props: {
        html: `<span style="font-size: 18px; line-height: 1.6; color: ${textColor};">${sectionCopy.paragraph}</span>`,
        align: section.type === "hero" ? "center" : "right",
      },
    });
  }

  // Add bullets
  if (sectionCopy.bullets && sectionCopy.bullets.length > 0) {
    const bulletsContainer: PageComponent = {
      id: `${section.id}-bullets-${timestamp}`,
      type: "Container",
      props: {
        style: {
          flexDirection: "column",
          gap: 12,
          alignItems: "flex-start",
        },
      },
      children: sectionCopy.bullets.map((bullet, index) => ({
        id: `${section.id}-bullet-${index}-${timestamp}`,
        type: "RichText",
        props: {
          html: `<span style="font-size: 16px;">• ${bullet}</span>`,
          align: "right",
        },
      })),
    };
    children.push(bulletsContainer);
  }

  // Add CTA buttons
  if (sectionCopy.ctaLabelPrimary) {
    children.push({
      id: `${section.id}-cta-primary-${timestamp}`,
      type: "Button",
      props: {
        text: sectionCopy.ctaLabelPrimary,
        href: "#",
        variant: "default",
        size: "lg",
      },
    });
  }

  if (sectionCopy.ctaLabelSecondary) {
    children.push({
      id: `${section.id}-cta-secondary-${timestamp}`,
      type: "Button",
      props: {
        text: sectionCopy.ctaLabelSecondary,
        href: "#",
        variant: "outline",
        size: "lg",
      },
    });
  }

  // Add FAQ component (if section type is FAQ)
  if (section.type === "faq") {
    // Use the FAQ component instead of building containers
    return {
      id: section.id,
      type: "FAQ",
      props: {
        headline: sectionCopy.heading || "שאלות נפוצות",
        questions: sectionCopy.faqItems || [],
      },
    };
  }

  // Add ImageText component (if sectionCopy has imageText)
  if (sectionCopy.imageText) {
    const imageText = sectionCopy.imageText;
    // Use Unsplash for image if not provided
    const imageSrc = imageText.imageSrc || `https://source.unsplash.com/800x600/?business,professional,${input.businessType}`;

    return {
      id: section.id,
      type: "ImageText",
      props: {
        imageSrc: imageSrc,
        imageAlt: imageText.imageAlt || `${businessName} - ${section.type}`,
        text: imageText.text || sectionCopy.paragraph || "",
        imagePosition: imageText.imagePosition || "right",
        imageWidth: 50,
        gap: 32,
        alignment: "center",
        backgroundColor: layoutHint?.showBackgroundAccent ? "#f8fafc" : undefined,
        padding: "48px 32px",
      },
    };
  }

  // Add testimonials
  if (sectionCopy.testimonials && sectionCopy.testimonials.length > 0) {
    sectionCopy.testimonials.forEach((testimonial, index) => {
      children.push({
        id: `${section.id}-testimonial-${index}-${timestamp}`,
        type: "Container",
        props: {
          style: {
            padding: "24px",
            background: "#f8fafc",
            borderRadius: "12px",
            maxWidth: "500px",
            flexDirection: "column",
            gap: 12,
          },
        },
        children: [
          {
            id: `${section.id}-testimonial-quote-${index}-${timestamp}`,
            type: "RichText",
            props: {
              html: `<span style="font-size: 16px; font-style: italic;">"${testimonial.quote}"</span>`,
              align: "center",
            },
          },
          {
            id: `${section.id}-testimonial-author-${index}-${timestamp}`,
            type: "RichText",
            props: {
              html: `<span style="font-size: 14px; color: #64748b;">— ${testimonial.name}, ${testimonial.role}</span>`,
              align: "center",
            },
          },
        ],
      });
    });
  }

  // Build container with appropriate styling
  const containerStyle: any = {
    padding:
      layoutHint?.emphasisLevel === "high"
        ? "96px 32px"
        : section.type === "hero"
          ? "80px 32px"
          : "64px 32px",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    width: "100%",
  };

  // Set background based on section type
  if (section.type === "hero") {
    containerStyle.background = layoutHint?.showBackgroundAccent
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)";
    // Make text white if gradient background
    if (layoutHint?.showBackgroundAccent) {
      // Text color will be handled by RichText components
    }
  } else if (section.type === "problem" || section.type === "solution") {
    containerStyle.background = "#f8fafc";
  } else if (section.type === "benefits") {
    containerStyle.background = "#ffffff";
  } else if (section.type === "socialProof") {
    containerStyle.background = "#f8fafc";
  } else if (section.type === "offer") {
    containerStyle.background =
      "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)";
  } else if (section.type === "cta") {
    containerStyle.background = layoutHint?.showBackgroundAccent
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "#1e293b";
  } else {
    containerStyle.background = layoutHint?.showBackgroundAccent
      ? "#f8fafc"
      : "#ffffff";
  }

  console.log(
    `✅ Built section ${section.id} with ${children.length} children`
  );

  // Always return a container, even if empty (for debugging)
  return {
    id: section.id,
    type: "Container",
    props: {
      style: containerStyle,
    },
    children,
  };
}
