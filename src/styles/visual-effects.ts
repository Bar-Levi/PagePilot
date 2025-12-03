/**
 * Visual Effects Utilities
 * 
 * Premium visual effects for landing pages including gradients,
 * glassmorphism, and decorative elements.
 */

import { designTokens } from './design-tokens';

// Gradient Presets
export const gradients = {
    // Vibrant Gradients
    sunset: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    forest: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    fire: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    sky: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',

    // Subtle Gradients
    softBlue: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    softPurple: 'linear-gradient(135deg, #f3e7ff 0%, #e9d5ff 100%)',
    softGreen: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    softPink: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',

    // Mesh Gradients (multi-color)
    mesh1: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
    mesh2: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',

    // Animated Gradients (use with animation)
    animated: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
};

// Glassmorphism Styles
export const glassStyles = {
    light: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    dark: {
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    colored: (color: string, opacity: number = 0.1) => ({
        background: `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${color}${Math.round((opacity + 0.1) * 255).toString(16).padStart(2, '0')}`,
        boxShadow: `0 8px 32px 0 ${color}37`,
    }),
};

// SVG Background Patterns
export const patterns = {
    dots: (color: string = '#e2e8f0', size: number = 20) => ({
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
    }),

    grid: (color: string = '#e2e8f0', size: number = 20) => ({
        backgroundImage: `
      linear-gradient(${color} 1px, transparent 1px),
      linear-gradient(90deg, ${color} 1px, transparent 1px)
    `,
        backgroundSize: `${size}px ${size}px`,
    }),

    waves: (color: string = '#3b82f6') => ({
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${color.replace('#', '%23')}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    }),
};

// Parallax Effect Helper
export const parallaxStyle = (speed: number = 0.5) => ({
    transform: `translateY(calc(var(--scroll, 0) * ${speed}px))`,
    transition: 'transform 0.1s ease-out',
});

// Animated Gradient Background
export const animatedGradientStyle = {
    background: gradients.animated,
    backgroundSize: '400% 400%',
    animation: 'gradientAnimation 15s ease infinite',
};

// Glow Effect
export const glowEffect = (color: string, intensity: number = 20) => ({
    boxShadow: `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`,
});

// Neumorphism (Soft UI)
export const neumorphism = {
    light: {
        background: '#e0e5ec',
        boxShadow: '9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)',
    },
    dark: {
        background: '#2d3748',
        boxShadow: '9px 9px 16px rgba(0, 0, 0, 0.4), -9px -9px 16px rgba(255, 255, 255, 0.05)',
    },
    inset: {
        boxShadow: 'inset 9px 9px 16px rgba(163, 177, 198, 0.6), inset -9px -9px 16px rgba(255, 255, 255, 0.5)',
    },
};

// Export all
export const visualEffects = {
    gradients,
    glassStyles,
    patterns,
    parallaxStyle,
    animatedGradientStyle,
    glowEffect,
    neumorphism,
};
