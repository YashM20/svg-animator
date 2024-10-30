import { AnimationError, ErrorCodes } from '../errors/AnimationError';
import type { TextConfig, TextAnimationConfig } from '../types';
import { FONT_MATRIX, DEFAULT_TEXT_ANIMATION_CONFIG } from '../constants';
import { AnimationManager } from './AnimationManager';

export class SVGTextCreator {
  private animationManager: AnimationManager;

  constructor() {
    this.animationManager = AnimationManager.getInstance();
  }

  public createAnimatedText(
    text: string,
    font: keyof typeof FONT_MATRIX,
    textConfig: TextConfig,
    animationConfig: Partial<TextAnimationConfig> = {}
  ): SVGTextElement {
    try {
      // Create text element
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

      // Apply text configuration
      textElement.setAttribute('x', textConfig.x.toString());
      textElement.setAttribute('y', textConfig.y.toString());
      if (textConfig.fontSize) textElement.setAttribute('font-size', textConfig.fontSize);
      if (textConfig.textAnchor) textElement.setAttribute('text-anchor', textConfig.textAnchor);
      if (textConfig.dominantBaseline) {
        textElement.setAttribute('dominant-baseline', textConfig.dominantBaseline);
      }

      // Set font family
      if (!FONT_MATRIX[font]) {
        throw new AnimationError(
          `Font "${font}" is not supported`,
          ErrorCodes.FONT_NOT_SUPPORTED
        );
      }
      textElement.setAttribute('font-family', font);

      // Set text content
      textElement.textContent = text;

      // Apply animation configuration
      const finalConfig = {
        ...DEFAULT_TEXT_ANIMATION_CONFIG,
        ...animationConfig,
      };

      // Generate unique animation name
      const animationId = `text-animation-${Math.random().toString(36).substr(2, 9)}`;
      const keyframes = this.animationManager.createKeyframes(animationId, finalConfig);

      // Apply animation styles
      textElement.style.animation = `
        ${animationId}-stroke ${finalConfig.duration}ms ${finalConfig.easing} 
        ${finalConfig.delay}ms ${finalConfig.iterations} ${finalConfig.direction} 
        ${finalConfig.fillMode}
      `;

      return textElement;
    } catch (error) {
      throw new AnimationError(
        `Failed to create animated text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorCodes.ANIMATION_FAILED
      );
    }
  }
}