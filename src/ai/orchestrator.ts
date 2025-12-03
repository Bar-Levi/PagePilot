"use server";

import type { BusinessInput } from "./types";
import type {
  DeepAnalysisOutput,
  StructuredSectionsOutput,
  ColorPalette,
  PageWithColors,
} from "./types-extended";
import {
  runDeepAnalysisAgent,
  runStructureMappingAgent,
  runColorPaletteAgent,
} from "./agents";
import { retrieveBusinessContext } from "./rag";
import { buildPageJsonV2 } from "./pageBuilder";

/**
 * Landing Page Generation Flow
 * 
 * Improved architecture with 4 clear stages:
 * 1. Deep Analysis & Raw Text Generation
 * 2. Structure & Sections Mapping  
 * 3. Color Palette Generation
 * 4. Final Page JSON Builder
 */
export async function generateLandingPageFlow(
  input: BusinessInput
): Promise<PageWithColors> {
  console.log("🚀 Starting Landing Page Generation Flow...");
  console.log("📥 Input:", JSON.stringify(input, null, 2));

  // ========================================================================
  // STEP 1: Deep Analysis & Raw Text Generation
  // ========================================================================
  console.log("\n🧠 STEP 1: Deep Analysis & Raw Text Generation");

  // Retrieve business context from RAG
  const businessKey = input.docsRefId || input.businessName;
  const ragChunks = await retrieveBusinessContext(
    businessKey,
    `landing page content for ${input.businessName}`
  );
  console.log(`📚 Retrieved ${ragChunks.length} RAG chunks`);

  // Run deep analysis agent
  const deepAnalysis: DeepAnalysisOutput = await runDeepAnalysisAgent({
    input,
    ragChunks,
  });
  console.log("✅ Deep Analysis Complete");

  // ========================================================================
  // STEP 2: Structure & Sections Mapping
  // ========================================================================
  console.log("\n🏗️ STEP 2: Structure & Sections Mapping");

  const structuredSections: StructuredSectionsOutput =
    await runStructureMappingAgent({
      input,
      deepAnalysis,
    });
  console.log(
    `✅ Structure Mapping Complete - ${structuredSections.sections.length} sections created`
  );

  // ========================================================================
  // STEP 3: Color Palette Generation
  // ========================================================================
  console.log("\n🎨 STEP 3: Color Palette Generation");

  const colorPalette: ColorPalette = await runColorPaletteAgent({
    input,
    deepAnalysis,
    structuredSections,
  });
  console.log(
    `✅ Color Palette Complete - Mood: ${colorPalette.metadata.mood}`
  );

  // ========================================================================
  // STEP 4: Final Page JSON Builder
  // ========================================================================
  console.log("\n📄 STEP 4: Final Page JSON Builder");

  const finalPage: PageWithColors = await buildPageJsonV2({
    input,
    deepAnalysis,
    structuredSections,
    colorPalette,
  });
  console.log("✅ Final Page JSON Complete");

  console.log("\n🎉 Landing Page Generation Flow Complete!");

  return finalPage;
}
