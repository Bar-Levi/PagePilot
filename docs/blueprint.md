# **App Name**: PagePilot

## Core Features:

- Automated Landing Page Generation: Generate a complete landing page using user inputs (business type, audience, tone, images). The system builds a full JSON page structure and applies a consistent design system. A tool selects the most appropriate information based on user prompts.
- Drag & Drop Page Editor: Allow users to add, remove, reorder, and reposition sections. Includes a component sidebar with Hero, Text+Image, Testimonials, FAQ, Pricing, Video Embed, CTA, and more.
- Inline Content Editing: Users can edit text inline with a rich-text toolbar (bold, underline, color, font size). Images and videos can be replaced directly from the editor.
- AI Copywriting Assistance: Suggest improved titles, CTAs, value propositions, and benefit statements based on successful landing pages in similar industries.
- Automatic Deployment: Once a page is created, deploy it automatically to Vercel or Netlify and provide the user with a live URL instantly.
- Analytics Integration: Allow users to connect Google Analytics ID, Facebook Pixel, Microsoft Clarity Project ID, and Hotjar Site ID. All scripts are auto-injected into the generated landing page.
- Style Customization: Users can adjust colors, typography, and layout while staying within the design system.
- HTML + Tailwind Export: Export production-ready HTML and Tailwind CSS matching the live preview.
- Onboarding Flow: A three-step onboarding process that collects business details, brand tone, images, and messaging.

## Style Guidelines:

- Primary (Action): #FF6B6B
- Primary Hover: #FF573E
- Accent (Success/Info): #13A4EC
- Background: #F8F9FA
- Cards: #FFFFFF
- Borders: #DEE2E6
- Text: #212529
- Centered layout
- Mobile: Single-column structure
- Desktop: Two-column responsive structure
- Generous spacing (padding 32–48px per section)
- Headlines: Manrope, weight 700–800
- Body: Manrope, weight 400–500
- Recommended sizes: 24–32px for titles, 16–18px for body text
- Material Symbols Outlined
- Icon sizes: 24–32px
- Accent color for icons: #FF6B6B
- Subtle fade-up animations on scroll
- No elements should load with opacity 0 (to preserve heatmap accuracy)