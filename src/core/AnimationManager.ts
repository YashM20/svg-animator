import { AnimationError, ErrorCodes } from '../errors/AnimationError';
import type { TextAnimationConfig } from '../types';
import { memoize } from '../utils/performance';

export class AnimationManager {
  private static instance: AnimationManager | null = null;
  private styleSheet: HTMLStyleElement | null = null;
  private cleanupCallbacks = new Map<string, () => void>();
  private readonly observers = new Set<(id: string) => void>();

  private constructor() {
    this.init();
  }

  private init(): void {
    try {
      if (typeof window === 'undefined') {
        throw new AnimationError(
          'Animation manager requires DOM environment',
          ErrorCodes.DOM_NOT_AVAILABLE
        );
      }
      this.styleSheet = this.createStyleSheet();
    } catch (error) {
      console.error('Failed to initialize AnimationManager:', error);
      throw error;
    }
  }

  public static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  private createStyleSheet(): HTMLStyleElement {
    const style = document.createElement('style');
    document.head.appendChild(style);
    return style;
  }

  public subscribe(observer: (id: string) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  private notifyObservers(id: string): void {
    this.observers.forEach((observer) => observer(id));
  }

  private createKeyframesString(animationName: string, config: TextAnimationConfig): string {
    return `
      @keyframes ${animationName}-stroke {
        0% {
          stroke-dashoffset: ${config.strokeDashoffset};
          fill: transparent;
        }
        60% {
          stroke-dashoffset: 0;
          fill: transparent;
        }
        80% {
          stroke-dashoffset: 0;
          fill: ${config.fillColor}40;
        }
        100% {
          stroke-dashoffset: 0;
          fill: ${config.fillColor};
        }
      }
    `;
  }

  public createKeyframes = memoize(
    (animationName: string, config: TextAnimationConfig): string => {
      const keyframes = this.createKeyframesString(animationName, config);
      if (this.styleSheet?.sheet) {
        const ruleIndex = this.styleSheet.sheet.cssRules.length;
        this.styleSheet.sheet.insertRule(keyframes, ruleIndex);

        this.cleanupCallbacks.set(animationName, () => {
          if (this.styleSheet?.sheet) {
            this.styleSheet.sheet.deleteRule(ruleIndex);
          }
        });
      }
      return animationName;
    }
  );

  public cleanup(id: string): void {
    if (!id) return;

    try {
      const callback = this.cleanupCallbacks.get(id);
      if (callback) {
        callback();
        this.cleanupCallbacks.delete(id);
        this.notifyObservers(id);
      }
    } catch (error) {
      console.error(`Failed to cleanup animation ${id}:`, error);
    }
  }

  public dispose(): void {
    try {
      this.cleanupCallbacks.forEach((callback) => callback());
      this.cleanupCallbacks.clear();
      this.styleSheet?.remove();
      AnimationManager.instance = null;
    } catch (error) {
      console.error('Failed to dispose AnimationManager:', error);
    }
  }
}