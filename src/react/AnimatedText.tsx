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

    let mounted = true;
    const cleanup = new Set<() => void>();

    const setupAnimation = async () => {
      try {
        const textElement = await creator.createAnimatedText(
          text,
          font,
          textConfig,
          animationConfig
        );

        // Check if component is still mounted
        if (!mounted || !svgRef.current) return;

        const handleAnimationStart = () => {
          onAnimationStart?.();
        };

        const handleAnimationEnd = () => {
          onAnimationEnd?.();
        };

        textElement.addEventListener('animationstart', handleAnimationStart);
        textElement.addEventListener('animationend', handleAnimationEnd);

        svgRef.current.appendChild(textElement);

        cleanup.add(() => {
          textElement.removeEventListener('animationstart', handleAnimationStart);
          textElement.removeEventListener('animationend', handleAnimationEnd);
          if (textElement.parentNode) {
            textElement.parentNode.removeChild(textElement);
          }
        });
      } catch (error) {
        if (!mounted) return;
        throw new AnimationError(
          `Failed to create animated text: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ErrorCodes.ANIMATION_FAILED
        );
      }
    };

    setupAnimation();

    return () => {
      mounted = false;
      cleanup.forEach(fn => fn());
      cleanup.clear();
    };
  }, [text, font, textConfig, animationConfig, creator, onAnimationStart, onAnimationEnd]);

  // Create a callback ref to handle both refs
  const setRefs = useCallback(
    (element: SVGSVGElement | null) => {
      svgRef.current = element;

      if (observerRef && typeof observerRef === 'object' && 'current' in observerRef) {
        (observerRef as React.MutableRefObject<Element | null>).current = element;
      }
    },
    [observerRef]
  );

  return (
    <svg
      ref={setRefs}
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
      data-testid="animated-text-svg"
    />
  );
};
