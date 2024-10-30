import type { AnimationConfig, TextAnimationConfig } from "./types";

export const FONT_MATRIX = {
  'Pinyon Script': {
    path: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap',
    weight: 400,
  },
  'Dancing Script': {
    path: 'https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap',
    weight: 400,
  },
  'Pacifico': {
    path: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
    weight: 400,
  },
} as const;

export const DEFAULT_ANIMATION_CONFIG: Required<AnimationConfig> = {
  duration: 2000,
  delay: 0,
  easing: 'ease',
  iterations: 1,
  direction: 'normal',
  fillMode: 'forwards',
};

export const DEFAULT_TEXT_ANIMATION_CONFIG: Required<TextAnimationConfig> = {
  ...DEFAULT_ANIMATION_CONFIG,
  strokeWidth: 2,
  strokeColor: '#000000',
  fillColor: '#000000',
  strokeDasharray: '100%',
  strokeDashoffset: '100%',
};