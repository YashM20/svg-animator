export class AnimationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AnimationError';
  }
}

export const ErrorCodes = {
  FONT_NOT_SUPPORTED: 'FONT_NOT_SUPPORTED',
  INVALID_CONFIG: 'INVALID_CONFIG',
  DOM_NOT_AVAILABLE: 'DOM_NOT_AVAILABLE',
  ANIMATION_FAILED: 'ANIMATION_FAILED',
} as const;