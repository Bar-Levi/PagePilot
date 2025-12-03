"use server";

import type { PageComponent } from "@/components/landing-page/types";
import type {
    DeepAnalysisOutput,
    StructuredSectionsOutput,
    SectionMapping,
    ColorPalette,
    PageWithColors,
} from "./types";
import type { BusinessInput } from "./types";

/**
 * Generate a unique ID for components
 */
function generateId(): string {
    return `${Date.now()} -${Math.random().toString(36).substring(2, 9)} `;
}

interface BuildPageJsonV2Input {
    input: BusinessInput;
    deepAnalysis: DeepAnalysisOutput;
    structuredSections: StructuredSectionsOutput;
    colorPalette: ColorPalette;
}

/**
 * Build the final PageComponent JSON with colors
 */
export async function buildPageJsonV2({
    input,
    deepAnalysis,
    structuredSections,
    colorPalette,
}: BuildPageJsonV2Input): Promise<PageWithColors> {
    // Sort sections by position
    const sortedSections = [...structuredSections.sections].sort(
        (a, b) => a.position - b.position
    );

    // Build page components
    const pageComponents: PageComponent[] = [];

    for (const section of sortedSections) {
        const component = buildSectionComponentV2({
            section,
            colorPalette,
            businessName: input.businessName,
        });

        if (component) {
            pageComponents.push(component);
        }
    }

    // Create the final page structure
    const page: PageComponent = {
        id: generateId(),
        type: "Page",
        props: {
            title: input.businessName,
            description: deepAnalysis.marketingStrategy.valueProposition,
            colorScheme: {
                primary: colorPalette.primary.main,
                secondary: colorPalette.secondary.main,
                accent: colorPalette.accent.main,
                background: colorPalette.background.default,
                text: colorPalette.text.primary,
            },
        },
        children: pageComponents,
    };

    // Create analytics recommendations
    const analytics = {
        recommendedEvents: [
            {
                name: "page_view",
                description: "Track landing page views",
                trigger: "On page load",
            },
            {
                name: "cta_click",
                description: "Track CTA button clicks",
                trigger: "When user clicks any CTA button",
            },
            {
                name: "form_start",
                description: "Track when user starts filling a form",
                trigger: "On first form field interaction",
            },
            {
                name: "form_submit",
                description: "Track form submissions",
                trigger: "On successful form submission",
            },
            {
                name: "scroll_depth",
                description: "Track how far users scroll",
                trigger: "At 25%, 50%, 75%, 100% scroll depth",
            },
        ],
        notesForUser: `מומלץ להגדיר מעקב אחר האירועים הבאים כדי למדוד את ביצועי דף הנחיתה ולבצע אופטימיזציה מתמשכת.שימו לב במיוחד למעקב אחר ${input.mainGoal === "leads" ? "שליחת טפסים" : input.mainGoal === "sales" ? "רכישות" : input.mainGoal === "booking" ? "הזמנות" : "הרשמות לניוזלטר"}.`,
    };

    return {
        page,
        colorPalette,
        analytics,
    };
}

/**
 * Build a single section component with colors
 */
function buildSectionComponentV2({
    section,
    colorPalette,
    businessName,
}: {
    section: SectionMapping;
    colorPalette: ColorPalette;
    businessName: string;
}): PageComponent | null {
    const { type, componentType, content, layoutHint } = section;

    // Determine background color based on layout hint
    let backgroundColor = colorPalette.background.default;
    if (layoutHint?.backgroundStyle === "accent") {
        backgroundColor = colorPalette.background.accent;
    } else if (layoutHint?.backgroundStyle === "gradient") {
        backgroundColor = `linear - gradient(135deg, ${colorPalette.primary.light} 0 %, ${colorPalette.secondary.light} 100 %)`;
    }

    // Build component based on type
    switch (type) {
        case "hero":
            return buildHeroSection(section, colorPalette);

        case "problem":
        case "solution":
            return buildTextImageSection(section, colorPalette);

        case "benefits":
        case "features":
            return buildBenefitsSection(section, colorPalette);

        case "howItWorks":
            return buildHowItWorksSection(section, colorPalette);

        case "socialProof":
        case "testimonials":
            return buildTestimonialsSection(section, colorPalette);

        case "stats":
            return buildStatsSection(section, colorPalette);

        case "faq":
            return buildFAQSection(section, colorPalette);

        case "cta":
            return buildCTASection(section, colorPalette);

        case "offer":
        case "pricing":
            return buildOfferSection(section, colorPalette);

        default:
            return buildGenericSection(section, colorPalette);
    }
}

// ============================================================================
// Section Builders
// ============================================================================

function buildHeroSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "hero-section",
            style: {
                backgroundColor: colorPalette.background.default,
                minHeight: "600px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "1200px",
                    textAlign: "center",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Heading",
                        props: {
                            level: 1,
                            text: section.content.heading || "",
                            style: {
                                color: colorPalette.text.primary,
                                fontSize: "3.5rem",
                                fontWeight: "bold",
                                marginBottom: "1.5rem",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Text",
                        props: {
                            text: section.content.subheading || "",
                            style: {
                                color: colorPalette.text.secondary,
                                fontSize: "1.5rem",
                                marginBottom: "2rem",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Button",
                        props: {
                            text: section.content.ctaText || "התחל עכשיו",
                            variant: "primary",
                            size: "large",
                            style: {
                                backgroundColor: colorPalette.accent.main,
                                color: colorPalette.accent.contrast,
                                padding: "1rem 2.5rem",
                                fontSize: "1.25rem",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                            },
                        },
                    },
                ],
            },
        ],
    };
}

function buildTextImageSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "text-image-section",
            style: {
                backgroundColor: colorPalette.background.paper,
                padding: "4rem 2rem",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "1200px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Heading",
                        props: {
                            level: 2,
                            text: section.content.heading || "",
                            style: {
                                color: colorPalette.text.primary,
                                fontSize: "2.5rem",
                                marginBottom: "1.5rem",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Text",
                        props: {
                            text: section.content.body || "",
                            style: {
                                color: colorPalette.text.secondary,
                                fontSize: "1.125rem",
                                lineHeight: "1.8",
                            },
                        },
                    },
                ],
            },
        ],
    };
}

function buildBenefitsSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    const bullets = section.content.bullets || [];

    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "benefits-section",
            style: {
                backgroundColor: colorPalette.background.default,
                padding: "4rem 2rem",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "1200px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Heading",
                        props: {
                            level: 2,
                            text: section.content.heading || "",
                            style: {
                                color: colorPalette.text.primary,
                                fontSize: "2.5rem",
                                marginBottom: "2rem",
                                textAlign: "center",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Grid",
                        props: {
                            columns: 3,
                            gap: "2rem",
                        },
                        children: bullets.map((bullet, index) => ({
                            id: generateId(),
                            type: "Card",
                            props: {
                                style: {
                                    backgroundColor: colorPalette.background.paper,
                                    padding: "2rem",
                                    borderRadius: "12px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                },
                            },
                            children: [
                                {
                                    id: generateId(),
                                    type: "Text",
                                    props: {
                                        text: bullet,
                                        style: {
                                            color: colorPalette.text.primary,
                                            fontSize: "1.125rem",
                                        },
                                    },
                                },
                            ],
                        })),
                    },
                ],
            },
        ],
    };
}

function buildHowItWorksSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    const items = section.content.items || [];

    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "how-it-works-section",
            style: {
                backgroundColor: colorPalette.background.paper,
                padding: "4rem 2rem",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "1200px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Heading",
                        props: {
                            level: 2,
                            text: section.content.heading || "איך זה עובד?",
                            style: {
                                color: colorPalette.text.primary,
                                fontSize: "2.5rem",
                                marginBottom: "2rem",
                                textAlign: "center",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Steps",
                        props: {
                            items: items,
                            accentColor: colorPalette.primary.main,
                        },
                    },
                ],
            },
        ],
    };
}

function buildTestimonialsSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    const items = section.content.items || [];

    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "testimonials-section",
            style: {
                backgroundColor: colorPalette.background.accent,
                padding: "4rem 2rem",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "1200px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Heading",
                        props: {
                            level: 2,
                            text: section.content.heading || "מה אומרים עלינו",
                            style: {
                                color: colorPalette.text.primary,
                                fontSize: "2.5rem",
                                marginBottom: "2rem",
                                textAlign: "center",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "TestimonialsGrid",
                        props: {
                            testimonials: items,
                            accentColor: colorPalette.primary.main,
                        },
                    },
                ],
            },
        ],
    };
}

function buildStatsSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    const items = section.content.items || [];

    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "stats-section",
            style: {
                backgroundColor: colorPalette.primary.main,
                padding: "3rem 2rem",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "1200px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "StatsGrid",
                        props: {
                            stats: items,
                            textColor: colorPalette.primary.contrast,
                        },
                    },
                ],
            },
        ],
    };
}

function buildFAQSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    const items = section.content.items || [];

    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "faq-section",
            style: {
                backgroundColor: colorPalette.background.default,
                padding: "4rem 2rem",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "900px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Heading",
                        props: {
                            level: 2,
                            text: section.content.heading || "שאלות נפוצות",
                            style: {
                                color: colorPalette.text.primary,
                                fontSize: "2.5rem",
                                marginBottom: "2rem",
                                textAlign: "center",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "FAQAccordion",
                        props: {
                            items: items,
                            accentColor: colorPalette.primary.main,
                        },
                    },
                ],
            },
        ],
    };
}

function buildCTASection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "cta-section",
            style: {
                backgroundColor: colorPalette.accent.main,
                padding: "4rem 2rem",
                textAlign: "center",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "800px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Heading",
                        props: {
                            level: 2,
                            text: section.content.heading || "",
                            style: {
                                color: colorPalette.accent.contrast,
                                fontSize: "2.5rem",
                                marginBottom: "1.5rem",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Text",
                        props: {
                            text: section.content.subheading || "",
                            style: {
                                color: colorPalette.accent.contrast,
                                fontSize: "1.25rem",
                                marginBottom: "2rem",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Button",
                        props: {
                            text: section.content.ctaText || "התחל עכשיו",
                            variant: "secondary",
                            size: "large",
                            style: {
                                backgroundColor: colorPalette.background.default,
                                color: colorPalette.text.primary,
                                padding: "1rem 2.5rem",
                                fontSize: "1.25rem",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                            },
                        },
                    },
                ],
            },
        ],
    };
}

function buildOfferSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "offer-section",
            style: {
                backgroundColor: colorPalette.background.paper,
                padding: "4rem 2rem",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "1000px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Heading",
                        props: {
                            level: 2,
                            text: section.content.heading || "",
                            style: {
                                color: colorPalette.text.primary,
                                fontSize: "2.5rem",
                                marginBottom: "1.5rem",
                                textAlign: "center",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Text",
                        props: {
                            text: section.content.body || "",
                            style: {
                                color: colorPalette.text.secondary,
                                fontSize: "1.125rem",
                                marginBottom: "2rem",
                                textAlign: "center",
                            },
                        },
                    },
                    {
                        id: generateId(),
                        type: "Button",
                        props: {
                            text: section.content.ctaText || "קבל את ההצעה",
                            variant: "primary",
                            size: "large",
                            style: {
                                backgroundColor: colorPalette.accent.main,
                                color: colorPalette.accent.contrast,
                                padding: "1rem 2.5rem",
                                fontSize: "1.25rem",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                display: "block",
                                margin: "0 auto",
                            },
                        },
                    },
                ],
            },
        ],
    };
}

function buildGenericSection(
    section: SectionMapping,
    colorPalette: ColorPalette
): PageComponent {
    return {
        id: generateId(),
        type: "Section",
        props: {
            id: section.id,
            className: "generic-section",
            style: {
                backgroundColor: colorPalette.background.default,
                padding: "4rem 2rem",
            },
        },
        children: [
            {
                id: generateId(),
                type: "Container",
                props: {
                    maxWidth: "1200px",
                },
                children: [
                    {
                        id: generateId(),
                        type: "Text",
                        props: {
                            text: section.content.body || section.content.heading || "",
                            style: {
                                color: colorPalette.text.primary,
                            },
                        },
                    },
                ],
            },
        ],
    };
}
