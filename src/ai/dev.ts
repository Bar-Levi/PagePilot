import { config } from 'dotenv';
config();

// Import old flows (for backward compatibility)
import '@/ai/flows/generate-landing-page-from-prompt.ts';
import '@/ai/flows/suggest-ai-copywriting-improvements.ts';

// Import new multi-agent system
// The orchestrator and agents are loaded on-demand when called