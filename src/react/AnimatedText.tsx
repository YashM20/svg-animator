import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useAnimationObserver } from '../hooks/useAnimationObserver';
import { validateTextConfig } from '../utils/validation';
import { AnimationError, ErrorCodes } from '../errors/AnimationError';
import type { FONT_MATRIX } from '../constants';
import type { TextAnimationConfig, TextConfig } from '../types';
import { SVGTextCreator } from '../core/SVGTextCreator';

interface AnimatedTextProps {
  text: string;
  font: keyof typeof FONT_MATRIX;
  textConfig: TextConfig;
  animationConfig?: TextAnimationConfig;
  className?: string;
  style?: React.CSSProperties;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  pauseWhenOutOfView?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  font,
  textConfig,
  animationConfig,
  className,
  style,
  onAnimationStart,
  onAnimationEnd,
  pauseWhenOutOfView = true,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animationIdRef = useRef<string>();

  // Validate configs
  useEffect(() => {
    try {
      validateTextConfig(textConfig);
    } catch (error) {
      console.error('Invalid configuration:', error);
      throw error;
    }
  }, [textConfig]);

  const handleInView = useCallback(() => {
    if (svgRef.current) {
      svgRef.current.style.animationPlayState = 'running';
    }
  }, []);

  const handleOutOfView = useCallback(() => {
    if (pauseWhenOutOfView && svgRef.current) {
      svgRef.current.style.animationPlayState = 'paused';
    }
  }, [pauseWhenOutOfView]);

  const observerRef = useAnimationObserver({
    onInView: handleInView,
    onOutOfView: handleOutOfView,
    threshold: 0.1,
  });

  const creator = useMemo(() => new SVGTextCreator(), []);

  useEffect(() => {
    if (!svgRef.current) return;

    try {
      const textElement = creator.createAnimatedText(
        text,
        font,
        textConfig,
        animationConfig
      );

      const handleAnimationStart = () => {
        onAnimationStart?.();
      };

      const handleAnimationEnd = () => {
        onAnimationEnd?.();
      };

      textElement.addEventListener('animationstart', handleAnimationStart);
      textElement.addEventListener('animationend', handleAnimationEnd);

      svgRef.current.appendChild(textElement);

      return () => {
        textElement.removeEventListener('animationstart', handleAnimationStart);
        textElement.removeEventListener('animationend', handleAnimationEnd);
        if (textElement.parentNode) {
          textElement.parentNode.removeChild(textElement);
        }
      };
    } catch (error) {
      throw new AnimationError(
        `Failed to create animated text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorCodes.ANIMATION_FAILED
      );
    }
  }, [text, font, textConfig, animationConfig, creator, onAnimationStart, onAnimationEnd]);

  // Create a callback ref to handle both refs
  const setRefs = useCallback(
    (element: SVGSVGElement | null) => {
      // Safe way to set the svgRef
      svgRef.current = element;

      // Safe way to set the observer ref
      if (observerRef && 'current' in observerRef) {
        (observerRef as React.MutableRefObject<SVGSVGElement | null>).current = element;
      }
    },
    [observerRef]
  );

  return (
    <svg
      ref={setRefs}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
      data-testid="animated-text-svg"
    />
  );
};
