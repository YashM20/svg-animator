export interface TextConfig {
  x: string | number;
  y: string | number;
  fontSize?: string;
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?: 'auto' | 'middle' | 'hanging';
}

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface TextAnimationConfig extends AnimationConfig {
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeDasharray?: string;
  strokeDashoffset?: string;
}