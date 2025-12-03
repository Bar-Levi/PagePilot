# Multi-Agent Landing Page Generation System - V2

## 🎯 Architecture Overview

This is the **improved V2 architecture** with a more logical and effective flow.

### The V2 Flow (4 Stages)

```
┌─────────────────────────────────────────────────────────────┐
│  Stage 1: DEEP ANALYSIS & RAW TEXT GENERATION              │
│  ─────────────────────────────────────────────────────────  │
│  • Analyze business + RAG documents                         │
│  • Deep audience analysis (demographics, psychographics)    │
│  • Problem-solution framework                               │
│  • Marketing strategy (behavioral economics, persuasion)    │
│  • Generate raw text content (unstructured)                 │
│                                                             │
│  Agent: Deep Analysis Agent                                 │
│  Output: DeepAnalysisOutput (analysis + raw text)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 2: STRUCTURE & SECTIONS MAPPING                     │
│  ─────────────────────────────────────────────────────────  │
│  • Visualize the complete landing page                      │
│  • Divide into logical sections (Hero → Footer)             │
│  • Map raw text content to sections                         │
│  • Choose appropriate components for each section           │
│                                                             │
│  Agent: Structure Mapping Agent                             │
│  Output: StructuredSectionsOutput (sections array)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 3: COLOR PALETTE GENERATION                         │
│  ─────────────────────────────────────────────────────────  │
│  • Analyze emotional message and audience                   │
│  • Apply color psychology                                   │
│  • Generate complete color palette                          │
│  • Ensure accessibility (WCAG AA compliance)                │
│                                                             │
│  Agent: Color Palette Agent                                 │
│  Output: ColorPalette (complete color scheme)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 4: FINAL PAGE JSON BUILDER                          │
│  ─────────────────────────────────────────────────────────  │
│  • Convert sections to PageComponent JSON                   │
│  • Apply color palette to all elements                      │
│  • Build complete page structure                            │
│                                                             │
│  Builder: Page Builder V2                                   │
│  Output: PageWithColors (final JSON + colors + analytics)   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

### V2 Files (New Architecture)
- `types-v2.ts` - Type definitions for V2 flow
- `agents-v2.ts` - All V2 agents (Deep Analysis, Structure Mapping, Color Palette)
- `orchestrator-v2.ts` - V2 orchestrator that coordinates the 4-stage flow
- `pageBuilder-v2.ts` - V2 page builder with color integration

### V1 Files (Legacy - Still Available)
- `types.ts` - Original type definitions
- `agents.ts` - Original 5 agents (Strategy, Structure, Copy, Design, Analytics)
- `orchestrator.ts` - Original orchestrator
- `pageBuilder.ts` - Original page builder

### Shared Files
- `rag.ts` - RAG system (used by both V1 and V2)
- `genkit.ts` - Genkit AI initialization
- `flows/` - Additional utility flows

## 🚀 Usage

### Using V2 Flow (Recommended)

```typescript
import { generateLandingPageFlowV2 } from "@/ai/orchestrator-v2";
import type { BusinessInput } from "@/ai/types";

const input: BusinessInput = {
  businessName: "שם העסק",
  businessType: "SaaS",
  audience: "בעלי עסקים קטנים",
  mainGoal: "leads",
  tone: "professional",
  pains: ["חוסר זמן", "מורכבות"],
  benefits: ["חוסך זמן", "קל לשימוש"],
  docsRefId: "optional-doc-id", // Optional: for RAG
};

const result = await generateLandingPageFlowV2(input);

// result contains:
// - page: Complete PageComponent JSON
// - colorPalette: Full color scheme
// - analytics: Analytics recommendations
```

### Using V1 Flow (Legacy)

```typescript
import { generateLandingPageFlow } from "@/ai/orchestrator";

const result = await generateLandingPageFlow(input);
// Returns: { page, analytics }
```

## 🎨 V2 Agents Deep Dive

### 1️⃣ Deep Analysis Agent

**Purpose:** Comprehensive business and audience analysis + raw text generation

**Input:**
- BusinessInput (business details)
- RAG chunks (business documents)

**Output:**
```typescript
{
  audienceAnalysis: {
    demographics: string
    psychographics: string
    painPoints: string[]
    desires: string[]
    objections: string[]
    language: string
  },
  problemSolutionFramework: {
    coreProblem: string
    problemAmplification: string
    solution: string
    uniqueApproach: string
    transformation: string
  },
  marketingStrategy: {
    valueProposition: string
    primaryPromise: string
    emotionalTriggers: string[]
    persuasionTechniques: string[]
    tonality: string
    messagingAngle: string
  },
  rawText: {
    heroMessage: string
    problemNarrative: string
    solutionPresentation: string
    benefitsDescription: string
    socialProofContent: string
    offerDetails: string
    faqContent: string
    ctaMessages: string[]
    additionalContent: string
  }
}
```

**Key Features:**
- Deep psychological analysis of target audience
- Behavioral economics and persuasion techniques
- RAG-constrained content generation (no hallucination)
- Hebrew language output

---

### 2️⃣ Structure Mapping Agent

**Purpose:** Transform raw text into structured landing page sections

**Input:**
- BusinessInput
- DeepAnalysisOutput (from Stage 1)

**Output:**
```typescript
{
  sections: [
    {
      id: string
      type: "hero" | "problem" | "solution" | "benefits" | ...
      position: number
      componentType: string
      content: {
        heading?: string
        subheading?: string
        body?: string
        bullets?: string[]
        ctaText?: string
        items?: any[]
        imagePrompt?: string
      }
      layoutHint?: {
        variant?: string
        emphasis?: "high" | "medium" | "low"
        backgroundStyle?: "solid" | "gradient" | "image" | "none"
      }
    }
  ],
  pageFlow: string
}
```

**Key Features:**
- Visualizes complete page flow
- Maps content to appropriate sections
- Chooses optimal component types
- Provides layout hints for each section

---

### 3️⃣ Color Palette Agent

**Purpose:** Generate a complete, accessible color scheme

**Input:**
- BusinessInput
- DeepAnalysisOutput
- StructuredSectionsOutput

**Output:**
```typescript
{
  primary: { main, light, dark, contrast }
  secondary: { main, light, dark, contrast }
  accent: { main, light, dark, contrast }
  neutral: { white, lightest, light, medium, dark, darkest, black }
  semantic: { success, warning, error, info }
  background: { default, paper, elevated, accent }
  text: { primary, secondary, disabled, inverse }
  metadata: { mood, reasoning }
}
```

**Key Features:**
- Color psychology based on industry and audience
- WCAG AA accessibility compliance
- Conversion-optimized accent colors
- Cultural considerations (Israeli/Hebrew market)

---

### 4️⃣ Page Builder V2

**Purpose:** Convert structured sections + colors into final PageComponent JSON

**Input:**
- BusinessInput
- DeepAnalysisOutput
- StructuredSectionsOutput
- ColorPalette

**Output:**
```typescript
{
  page: PageComponent (complete JSON structure)
  colorPalette: ColorPalette
  analytics: {
    recommendedEvents: Array<{name, description, trigger}>
    notesForUser: string
  }
}
```

**Key Features:**
- Converts each section to appropriate component
- Applies color palette throughout
- Creates accessible, styled components
- Includes analytics recommendations

## 🔄 Migration from V1 to V2

The V2 API is **backward compatible**. You can:

1. **Use V2 for new pages:**
   ```typescript
   import { generateLandingPageFlowV2 } from "@/ai/orchestrator-v2";
   ```

2. **Keep V1 for existing pages:**
   ```typescript
   import { generateLandingPageFlow } from "@/ai/orchestrator";
   ```

3. **Gradually migrate** by updating your API routes to use V2

## 🎯 Why V2 is Better

| Aspect | V1 | V2 |
|--------|----|----|
| **Analysis Depth** | Separate agents, shallow | Single deep analysis, comprehensive |
| **Content Flow** | Structure → Copy (illogical) | Content → Structure (logical) |
| **Color Design** | Hints only | Complete palette with psychology |
| **Marketing Focus** | Basic | Behavioral economics + persuasion |
| **RAG Integration** | Late stage | Early stage, informs everything |
| **Accessibility** | Not considered | WCAG AA compliant colors |

## 📝 Example Output

See the console logs when running V2:
```
🚀 Starting V2 Landing Page Generation Flow...
🧠 STEP 1: Deep Analysis & Raw Text Generation
📚 Retrieved 5 RAG chunks
✅ Deep Analysis Complete
🏗️ STEP 2: Structure & Sections Mapping
✅ Structure Mapping Complete - 8 sections created
🎨 STEP 3: Color Palette Generation
✅ Color Palette Complete - Mood: energetic and trustworthy
📄 STEP 4: Final Page JSON Builder
✅ Final Page JSON Complete
🎉 V2 Landing Page Generation Flow Complete!
```

## 🔧 Configuration

Both V1 and V2 require:
- `GEMINI_API_KEY` or `GOOGLE_API_KEY` environment variable
- Genkit AI setup (see `genkit.ts`)

## 📚 Additional Resources

- See `flows/` directory for utility flows:
  - `ai-text-assist.ts` - Text improvement
  - `suggest-ai-copywriting-improvements.ts` - Copywriting suggestions
  - `generate-landing-page-from-prompt.ts` - Simple prompt-based generation
