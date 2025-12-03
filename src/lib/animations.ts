// Animation configuration types and utilities

export type AnimationType =
  | "none"
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "slideInUp"
  | "slideInDown"
  | "slideInLeft"
  | "slideInRight"
  | "zoomIn"
  | "zoomInUp"
  | "zoomInDown"
  | "bounce"
  | "pulse"
  | "shake"
  | "flip"
  | "rotate";

export type AnimationTrigger = "onLoad" | "onScroll" | "onHover";

export type AnimationConfig = {
  type: AnimationType;
  duration?: number; // in ms
  delay?: number; // in ms
  trigger?: AnimationTrigger;
  easing?: string;
  repeat?: boolean;
  threshold?: number; // for scroll trigger (0-1)
};

// Default animation config
export const defaultAnimationConfig: AnimationConfig = {
  type: "none",
  duration: 600,
  delay: 0,
  trigger: "onScroll",
  easing: "ease-out",
  repeat: false,
  threshold: 0.2,
};

// Animation keyframes definitions
export const animationKeyframes: Record<AnimationType, string> = {
  none: "",
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  fadeInDown: `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  fadeInLeft: `
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  fadeInRight: `
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  slideInUp: `
    @keyframes slideInUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `,
  slideInDown: `
    @keyframes slideInDown {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `,
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `,
  zoomIn: `
    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  zoomInUp: `
    @keyframes zoomInUp {
      from {
        opacity: 0;
        transform: scale(0.5) translateY(30px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `,
  zoomInDown: `
    @keyframes zoomInDown {
      from {
        opacity: 0;
        transform: scale(0.5) translateY(-30px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 20%, 53%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      43% {
        transform: translateY(-15px);
      }
      70% {
        transform: translateY(-15px);
      }
      80% {
        transform: translateY(-4px);
      }
      90% {
        transform: translateY(-4px);
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
  `,
  shake: `
    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
      }
      20%, 40%, 60%, 80% {
        transform: translateX(5px);
      }
    }
  `,
  flip: `
    @keyframes flip {
      from {
        transform: perspective(400px) rotateY(90deg);
        opacity: 0;
      }
      40% {
        transform: perspective(400px) rotateY(-10deg);
      }
      70% {
        transform: perspective(400px) rotateY(10deg);
      }
      to {
        transform: perspective(400px) rotateY(0);
        opacity: 1;
      }
    }
  `,
  rotate: `
    @keyframes rotate {
      from {
        transform: rotate(-180deg);
        opacity: 0;
      }
      to {
        transform: rotate(0);
        opacity: 1;
      }
    }
  `,
};

// Get CSS animation string
export function getAnimationCSS(config: AnimationConfig): string {
  if (config.type === "none") return "";

  const animationName = config.type;
  const duration = config.duration || 600;
  const delay = config.delay || 0;
  const easing = config.easing || "ease-out";
  const iteration = config.repeat ? "infinite" : "1";

  return `${animationName} ${duration}ms ${easing} ${delay}ms ${iteration} both`;
}

// Get initial styles (before animation)
export function getInitialStyles(config: AnimationConfig): React.CSSProperties {
  if (config.type === "none") return {};

  switch (config.type) {
    case "fadeIn":
    case "fadeInUp":
    case "fadeInDown":
    case "fadeInLeft":
    case "fadeInRight":
    case "zoomIn":
    case "zoomInUp":
    case "zoomInDown":
    case "flip":
    case "rotate":
      return { opacity: 0 };
    default:
      return {};
  }
}

// Animation presets for quick selection
export const animationPresets: Array<{
  type: AnimationType;
  label: string;
  labelHe: string;
  preview: string;
}> = [
  { type: "none", label: "None", labelHe: "ללא", preview: "—" },
  { type: "fadeIn", label: "Fade In", labelHe: "הופעה הדרגתית", preview: "↓" },
  { type: "fadeInUp", label: "Fade In Up", labelHe: "הופעה מלמטה", preview: "↑" },
  { type: "fadeInDown", label: "Fade In Down", labelHe: "הופעה מלמעלה", preview: "↓" },
  { type: "fadeInLeft", label: "Fade In Left", labelHe: "הופעה משמאל", preview: "→" },
  { type: "fadeInRight", label: "Fade In Right", labelHe: "הופעה מימין", preview: "←" },
  { type: "slideInUp", label: "Slide In Up", labelHe: "החלקה מלמטה", preview: "⬆" },
  { type: "slideInDown", label: "Slide In Down", labelHe: "החלקה מלמעלה", preview: "⬇" },
  { type: "slideInLeft", label: "Slide In Left", labelHe: "החלקה משמאל", preview: "➡" },
  { type: "slideInRight", label: "Slide In Right", labelHe: "החלקה מימין", preview: "⬅" },
  { type: "zoomIn", label: "Zoom In", labelHe: "התקרבות", preview: "⊕" },
  { type: "zoomInUp", label: "Zoom In Up", labelHe: "התקרבות מלמטה", preview: "⊕↑" },
  { type: "bounce", label: "Bounce", labelHe: "קפיצה", preview: "⤴" },
  { type: "pulse", label: "Pulse", labelHe: "פעימה", preview: "◎" },
  { type: "shake", label: "Shake", labelHe: "רעידה", preview: "↔" },
  { type: "flip", label: "Flip", labelHe: "סיבוב", preview: "⟳" },
  { type: "rotate", label: "Rotate", labelHe: "סיבוב", preview: "↻" },
];

// Easing options
export const easingOptions = [
  { value: "linear", label: "Linear" },
  { value: "ease", label: "Ease" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In Out" },
  { value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", label: "Back" },
  { value: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", label: "Elastic" },
];

