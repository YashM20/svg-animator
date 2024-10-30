import { z } from 'zod';
import { AnimationError, ErrorCodes } from '../errors/AnimationError';
import type { TextConfig, AnimationConfig } from '../types';

const textConfigSchema = z.object({
  x: z.union([z.string(), z.number()]),
  y: z.union([z.string(), z.number()]),
  fontSize: z.string().optional(),
  textAnchor: z.enum(['start', 'middle', 'end']).optional(),
  dominantBaseline: z.enum(['auto', 'middle', 'hanging']).optional(),
});

const animationConfigSchema = z.object({
  duration: z.number().optional(),
  delay: z.number().optional(),
  easing: z.string().optional(),
  iterations: z.number().optional(),
  direction: z.enum(['normal', 'reverse', 'alternate', 'alternate-reverse']).optional(),
  fillMode: z.enum(['none', 'forwards', 'backwards', 'both']).optional(),
});

export const validateTextConfig = (config: TextConfig): void => {
  try {
    textConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AnimationError(
        `Invalid text configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorCodes.INVALID_CONFIG
      );
    }
    throw error;
  }
};

export const validateAnimationConfig = (config: AnimationConfig): void => {
  try {
    animationConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AnimationError(
        `Invalid animation configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorCodes.INVALID_CONFIG
      );
    }
    throw error;
  }
};