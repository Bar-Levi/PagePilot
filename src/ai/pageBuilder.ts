"use server";

import type { PageComponent, ComponentType } from "@/components/landing-page/types";
import type {
    DeepAnalysisOutput,
    StructuredSectionsOutput,
    SectionMapping,
    ColorPalette,
    PageWithColors,
} from "./types";
import type { BusinessInput } from "./types";

// ============================================================================
// HELPERS
// ============================================================================

function generateId(prefix: string = "comp"): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

function c(type: ComponentType, props: any, children?: PageComponent[]): PageComponent {
    return {
        id: generateId(type.toLowerCase()),
        type,
        props,
        children,
    };
}

function richText(html: string, align: string = "center"): PageComponent {
    return c("RichText", { html, align });
}

function button(text: string, href: string = "#contact", variant: string = "default", size: string = "lg"): PageComponent {
    return c("Button", { text, href, variant, size });
}

// ============================================================================
// MAIN BUILDER
// ============================================================================

interface BuildPageJsonV2Input {
    input: BusinessInput;
    deepAnalysis: DeepAnalysisOutput;
    structuredSections: StructuredSectionsOutput;
    colorPalette: ColorPalette;
}

export async function buildPageJsonV2({
    input,
    deepAnalysis,
    structuredSections,
    colorPalette,
}: BuildPageJsonV2Input): Promise<PageWithColors> {
    const sortedSections = [...structuredSections.sections].sort(
        (a, b) => a.position - b.position
    );

    const pageComponents: PageComponent[] = [];

    for (const section of sortedSections) {
        const component = buildModernSection(section, colorPalette);
        if (component) {
            pageComponents.push(component);
        }
    }

    const page: PageComponent = {
        id: "page-root",
        type: "Page",
        props: {
            title: input.businessName,
            description: deepAnalysis.marketingStrategy.valueProposition,
        },
        children: pageComponents,
    };

    const analytics = {
        recommendedEvents: [
            { name: "page_view", description: "Track landing page views", trigger: "On page load" },
            { name: "cta_click", description: "Track CTA button clicks", trigger: "When user clicks any CTA button" },
            { name: "form_submit", description: "Track form submissions", trigger: "On successful form submission" },
        ],
        notesForUser: `מומלץ להגדיר מעקב אחר האירועים הבאים כדי למדוד את ביצועי דף הנחיתה.`,
    };

    return { page, colorPalette, analytics };
}

// ============================================================================
// SECTION ROUTER
// ============================================================================

function buildModernSection(section: SectionMapping, colors: ColorPalette): PageComponent | null {
    switch (section.type) {
        case "hero":
            return buildHero(section, colors);
        case "problem":
            return buildProblem(section, colors);
        case "solution":
            return buildSolution(section, colors);
        case "benefits":
        case "features":
            return buildBenefits(section, colors);
        case "howItWorks":
            return buildHowItWorks(section, colors);
        case "socialProof":
        case "testimonials":
            return buildTestimonials(section, colors);
        case "stats":
            return buildStats(section, colors);
        case "faq":
            return buildFAQ(section, colors);
        case "cta":
            return buildCTA(section, colors);
        case "offer":
        case "pricing":
            return buildOffer(section, colors);
        // Professional landing page section types
        case "authority":
            return buildAuthority(section, colors);
        case "disqualification":
            return buildDisqualification(section, colors);
        case "valueStack":
            return buildValueStack(section, colors);
        case "guarantee":
            return buildGuarantee(section, colors);
        case "painPoints":
            return buildPainPoints(section, colors);
        case "roadmap":
            return buildRoadmap(section, colors);
        default:
            return buildGeneric(section, colors);
    }
}

// ============================================================================
// HERO SECTION
// ============================================================================

function buildHero(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, subheading, ctaText } = section.content;

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            minHeight: "600px",
        },
    }, [
        richText(`<h1 style="font-size: 48px; font-weight: 800; color: white; text-align: center; line-height: 1.2; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${heading || ""}</h1>`),
        richText(`<p style="font-size: 20px; color: rgba(255,255,255,0.9); text-align: center; max-width: 700px; line-height: 1.6; margin: 0;">${subheading || ""}</p>`),
        button(ctaText || "התחל עכשיו"),
    ]);
}

// ============================================================================
// PROBLEM SECTION
// ============================================================================

function buildProblem(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, body } = section.content;

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: colors.background.paper,
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
        },
    }, [
        richText(`<h2 style="font-size: 36px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0; max-width: 800px;">${heading || ""}</h2>`),
        richText(`<p style="font-size: 18px; color: ${colors.text.secondary}; text-align: center; line-height: 1.8; max-width: 700px; margin: 0;">${body || ""}</p>`),
    ]);
}

// ============================================================================
// SOLUTION SECTION
// ============================================================================

function buildSolution(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, body, ctaText } = section.content;

    const children: PageComponent[] = [
        richText(`<h2 style="font-size: 36px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0; max-width: 800px;">${heading || ""}</h2>`),
        richText(`<p style="font-size: 18px; color: ${colors.text.secondary}; text-align: center; line-height: 1.8; max-width: 700px; margin: 0;">${body || ""}</p>`),
    ];

    if (ctaText) {
        children.push(button(ctaText));
    }

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: colors.background.default,
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
        },
    }, children);
}

// ============================================================================
// BENEFITS SECTION
// ============================================================================

function buildBenefits(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, bullets = [] } = section.content;

    const benefitCards: PageComponent[] = bullets.slice(0, 6).map((bullet: string, index: number) =>
        c("Container", {
            style: {
                padding: "32px",
                background: colors.background.paper,
                borderRadius: "16px",
                flexDirection: "column",
                gap: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: `1px solid ${colors.background.accent}`,
                flex: "1",
                minWidth: "280px",
                maxWidth: "350px",
            },
        }, [
            richText(`<div style="width: 48px; height: 48px; background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main}); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">✓</div>`, "right"),
            richText(`<p style="font-size: 16px; color: ${colors.text.primary}; line-height: 1.6; margin: 0; font-weight: 500;">${bullet}</p>`, "right"),
        ])
    );

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: colors.background.default,
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
        },
    }, [
        richText(`<h2 style="font-size: 36px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0;">${heading || "היתרונות שלנו"}</h2>`),
        c("Container", {
            style: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 24,
                maxWidth: "1200px",
            },
        }, benefitCards),
    ]);
}

// ============================================================================
// HOW IT WORKS SECTION
// ============================================================================

function buildHowItWorks(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, items = [] } = section.content;

    const stepCards: PageComponent[] = items.slice(0, 4).map((item: any, index: number) => {
        const text = typeof item === 'string' ? item : (item?.text || item?.step || '');

        return c("Container", {
            style: {
                padding: "32px",
                background: colors.background.paper,
                borderRadius: "16px",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                flex: "1",
                minWidth: "220px",
                maxWidth: "280px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            },
        }, [
            richText(`<div style="width: 56px; height: 56px; background: ${colors.primary.main}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700;">${index + 1}</div>`),
            richText(`<p style="font-size: 16px; color: ${colors.text.primary}; text-align: center; line-height: 1.6; margin: 0;">${text}</p>`),
        ]);
    });

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: colors.background.accent,
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
        },
    }, [
        richText(`<h2 style="font-size: 36px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0;">${heading || "איך זה עובד?"}</h2>`),
        c("Container", {
            style: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 24,
                maxWidth: "1200px",
            },
        }, stepCards),
    ]);
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

function buildTestimonials(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, items = [] } = section.content;

    const testimonialCards: PageComponent[] = items.slice(0, 3).map((item: any, _index: number) => {
        const quote = typeof item === 'string' ? item : (item?.quote || item?.text || '');
        const author = typeof item === 'object' ? (item?.author || item?.name || "") : "";

        const cardChildren: PageComponent[] = [
            richText(`<p style="font-size: 16px; color: ${colors.text.secondary}; line-height: 1.7; margin: 0; font-style: italic;">"${quote}"</p>`, "right"),
        ];

        if (author) {
            cardChildren.push(richText(`<p style="font-size: 14px; color: ${colors.text.primary}; font-weight: 600; margin: 0;">— ${author}</p>`, "right"));
        }

        return c("Container", {
            style: {
                padding: "32px",
                background: colors.background.paper,
                borderRadius: "16px",
                flexDirection: "column",
                gap: 20,
                flex: "1",
                minWidth: "300px",
                maxWidth: "380px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                borderTop: `4px solid ${colors.primary.main}`,
            },
        }, cardChildren);
    });

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: colors.background.default,
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
        },
    }, [
        richText(`<h2 style="font-size: 36px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0;">${heading || "מה אומרים עלינו"}</h2>`),
        c("Container", {
            style: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 24,
                maxWidth: "1200px",
            },
        }, testimonialCards),
    ]);
}

// ============================================================================
// STATS SECTION
// ============================================================================

function buildStats(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, items = [] } = section.content;

    const statCards: PageComponent[] = items.slice(0, 4).map((item: any, _index: number) => {
        const value = typeof item === 'object' ? (item?.value || item?.stat || "") : "";
        const label = typeof item === 'object' ? (item?.label || "") : item;

        return c("Container", {
            style: {
                padding: "24px 32px",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                flex: "1",
                minWidth: "150px",
            },
        }, [
            richText(`<span style="font-size: 48px; font-weight: 800; color: white; display: block;">${value}</span>`),
            richText(`<span style="font-size: 16px; color: rgba(255,255,255,0.9); display: block;">${label}</span>`),
        ]);
    });

    const children: PageComponent[] = [];

    if (heading) {
        children.push(richText(`<h2 style="font-size: 32px; font-weight: 700; color: white; text-align: center; margin: 0;">${heading}</h2>`));
    }

    children.push(c("Container", {
        style: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 48,
            maxWidth: "1000px",
        },
    }, statCards));

    return c("Container", {
        style: {
            padding: "60px 24px",
            background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark || colors.secondary.main} 100%)`,
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
        },
    }, children);
}

// ============================================================================
// FAQ SECTION
// ============================================================================

function buildFAQ(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, items = [] } = section.content;

    const faqItems = items.map((item: any) => {
        if (typeof item === 'string') {
            const parts = item.split(' ת: ');
            return { question: parts[0]?.replace('ש: ', '') || '', answer: parts[1] || '' };
        }
        return { question: item?.question || '', answer: item?.answer || '' };
    });

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: colors.background.paper,
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
        },
    }, [
        richText(`<h2 style="font-size: 36px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0;">${heading || "שאלות נפוצות"}</h2>`),
        c("FAQAccordion", { items: faqItems, accentColor: colors.primary.main }),
    ]);
}

// ============================================================================
// CTA SECTION
// ============================================================================

function buildCTA(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, subheading, ctaText } = section.content;

    const children: PageComponent[] = [
        richText(`<h2 style="font-size: 40px; font-weight: 700; color: white; text-align: center; margin: 0; max-width: 700px;">${heading || ""}</h2>`),
    ];

    if (subheading) {
        children.push(richText(`<p style="font-size: 18px; color: rgba(255,255,255,0.9); text-align: center; margin: 0; max-width: 600px;">${subheading}</p>`));
    }

    children.push(button(ctaText || "התחל עכשיו", "#contact", "secondary"));

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: `linear-gradient(135deg, ${colors.accent.main} 0%, ${colors.primary.main} 100%)`,
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
        },
    }, children);
}

// ============================================================================
// OFFER SECTION
// ============================================================================

function buildOffer(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, body, ctaText } = section.content;

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: colors.background.accent,
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
        },
    }, [
        richText(`<h2 style="font-size: 36px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0;">${heading || ""}</h2>`),
        richText(`<p style="font-size: 18px; color: ${colors.text.secondary}; text-align: center; line-height: 1.8; max-width: 700px; margin: 0;">${body || ""}</p>`),
        button(ctaText || "קבל את ההצעה"),
    ]);
}

// ============================================================================
// GENERIC SECTION
// ============================================================================

function buildGeneric(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, body } = section.content;

    const children: PageComponent[] = [];

    if (heading) {
        children.push(richText(`<h2 style="font-size: 32px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0;">${heading}</h2>`));
    }

    if (body) {
        children.push(richText(`<p style="font-size: 16px; color: ${colors.text.secondary}; text-align: center; line-height: 1.7; max-width: 700px; margin: 0;">${body}</p>`));
    }

    return c("Container", {
        style: {
            padding: "60px 24px",
            background: colors.background.default,
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
        },
    }, children);
}

// ============================================================================
// PROFESSIONAL LANDING PAGE SECTIONS
// ============================================================================

function buildAuthority(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, body, imagePrompt } = section.content;

    return c("AuthorityBio", {
        name: "",
        headline: heading || "",
        story: body || "",
        imageSrc: imagePrompt ? `[IMAGE: ${imagePrompt}]` : "",
        accentColor: colors.primary.main,
        textColor: colors.text.primary,
        backgroundColor: colors.background.default,
    });
}

function buildDisqualification(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, body, bullets = [] } = section.content;

    return c("DisqualificationCard", {
        headline: heading || "למי זה לא מתאים?",
        description: body || "",
        items: bullets,
        closingStatement: "התהליך הזה לא בשבילך.",
        accentColor: colors.semantic.error,
        textColor: colors.text.primary,
        backgroundColor: colors.background.default,
        cardBackground: colors.background.paper,
    });
}

function buildValueStack(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, subheading, items = [], ctaText } = section.content;

    const valueItems = items.map((item: any) => {
        if (typeof item === 'string') {
            return { title: item, description: '', value: '' };
        }
        return {
            title: item.title || item.name || '',
            description: item.description || '',
            value: item.value || item.price || '',
        };
    });

    return c("ValueStack", {
        headline: heading || "מה אתה מקבל בנוסף?",
        subheadline: subheading || "",
        items: valueItems,
        totalValue: "",
        accentColor: colors.primary.main,
        textColor: colors.text.primary,
        backgroundColor: colors.background.default,
        cardBackground: colors.background.paper,
        ctaText: ctaText || "",
    });
}

function buildGuarantee(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, body, ctaText } = section.content;

    return c("GuaranteeSection", {
        headline: heading || "למה אני מתחייב לך לתוצאות?",
        content: body || "",
        warningText: "",
        ctaText: ctaText || "",
        accentColor: colors.primary.main,
        warningColor: colors.semantic.warning,
        textColor: colors.text.primary,
        backgroundColor: colors.background.default,
    });
}

function buildPainPoints(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, bullets = [] } = section.content;

    const painCards: PageComponent[] = bullets.slice(0, 4).map((bullet: string, index: number) => {
        const icons: ("trending-down" | "clock" | "dollar" | "alert")[] = ["trending-down", "clock", "dollar", "alert"];
        return c("PainPointCard", {
            icon: icons[index % icons.length],
            title: bullet,
            description: "",
            accentColor: colors.semantic.error,
            textColor: colors.text.primary,
            backgroundColor: colors.background.paper,
        });
    });

    return c("Container", {
        style: {
            padding: "80px 24px",
            background: colors.background.default,
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
        },
    }, [
        richText(`<h2 style="font-size: 36px; font-weight: 700; color: ${colors.text.primary}; text-align: center; margin: 0;">${heading || "אם אחד מאלה נשמע לך מוכר, אתה במקום הנכון:"}</h2>`),
        c("Container", {
            style: {
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 24,
                maxWidth: "1000px",
            },
        }, painCards),
    ]);
}

function buildRoadmap(section: SectionMapping, colors: ColorPalette): PageComponent {
    const { heading, subheading, items = [] } = section.content;

    const steps = items.map((item: any, index: number) => {
        const icons: ("trending-up" | "shield" | "target" | "rocket" | "check" | "award")[] =
            ["target", "trending-up", "shield", "rocket", "check", "award"];

        if (typeof item === 'string') {
            return { number: index + 1, title: item, description: '', icon: icons[index % icons.length] };
        }
        return {
            number: index + 1,
            title: item.title || item.step || '',
            description: item.description || '',
            icon: icons[index % icons.length],
        };
    });

    return c("StepsRoadmap", {
        headline: heading || "השלבים להצלחה",
        subheadline: subheading || "",
        steps: steps,
        accentColor: colors.primary.main,
        textColor: colors.text.primary,
        backgroundColor: colors.background.default,
        cardBackground: colors.background.paper,
    });
}
