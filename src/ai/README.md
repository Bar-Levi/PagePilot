# Multi-Agent Landing Page Generation System

This directory contains a refactored multi-agent architecture for generating landing pages using Genkit and Google's Gemini AI.

## Architecture Overview

The system is organized into specialized agents that work together:

1. **Strategy Agent** (`agents.ts`) - Refines value proposition and marketing strategy
2. **Structure Agent** (`agents.ts`) - Designs the page structure and section flow
3. **Copy Agent with RAG** (`agents.ts`) - Generates all text content based on business documents
4. **Design Agent** (`agents.ts`) - Provides layout and design recommendations
5. **Analytics Agent** (`agents.ts`) - Recommends tracking events and analytics setup

## Key Files

- `types.ts` - Shared TypeScript interfaces for inputs and outputs
- `rag.ts` - RAG (Retrieval Augmented Generation) layer for document indexing and retrieval
- `agents.ts` - All 5 specialized agents as Genkit prompts/flows
- `orchestrator.ts` - Main flow that coordinates all agents
- `pageBuilder.ts` - Converts agent outputs into PageComponent JSON structure

## RAG System

The RAG system (`rag.ts`) currently uses in-memory storage for document chunks. To use a production vector store:

1. Replace `chunkStore` Map with your vector store (Pinecone, Weaviate, etc.)
2. Add embedding generation using Genkit's embedding models
3. Update `retrieveBusinessContext` to use vector similarity search

## Usage

### API Endpoint

POST `/api/generate-page`

Request body:
```json
{
  "businessName": "My Business",
  "businessType": "SaaS",
  "audience": "Small business owners",
  "mainGoal": "leads",
  "tone": "professional",
  "pains": ["lack of time", "complexity"],
  "benefits": ["saves time", "easy to use"],
  "businessContext": "Optional text context",
  "docsRefId": "optional-doc-id"
}
```

Response:
```json
{
  "page": PageComponent,
  "analytics": AnalyticsOutput
}
```

### Direct Function Call

```typescript
import { generateLandingPageFlow } from "@/ai/orchestrator";
import type { BusinessInput } from "@/ai/types";

const input: BusinessInput = {
  businessName: "My Business",
  businessType: "SaaS",
  audience: "Small business owners",
  mainGoal: "leads",
  tone: "professional",
  pains: ["lack of time"],
  benefits: ["saves time"],
};

const result = await generateLandingPageFlow(input);
// result.page is a PageComponent ready for the editor
// result.analytics contains tracking recommendations
```

## RAG Constraints

The Copy Agent is strictly constrained to only use information from the RAG context:

- All text generation must be based on provided documents
- Missing information uses placeholders (e.g., `[כאן יופיע תיאור השירות]`)
- No hallucination - the agent will not invent details not in the context

## Backward Compatibility

The system maintains backward compatibility with the old `generateLandingPage` function. The API route accepts both old and new input formats.

