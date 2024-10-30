import { FONT_MATRIX } from '../constants';
import { AnimationError, ErrorCodes } from '../errors/AnimationError';

const loadedFonts = new Set<string>();

export const loadFont = async (fontFamily: keyof typeof FONT_MATRIX) => {
  try {
    if (loadedFonts.has(fontFamily)) return;

    const font = FONT_MATRIX[fontFamily];
    if (!font) {
      throw new AnimationError(
        `Font "${fontFamily}" is not supported`,
        ErrorCodes.FONT_NOT_SUPPORTED
      );
    }

    const link = document.createElement('link');
    link.href = font.path;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    await new Promise((resolve, reject) => {
      link.onload = () => {
        loadedFonts.add(fontFamily);
        resolve(undefined);
      };
      link.onerror = () => reject(new AnimationError(
        `Failed to load font "${fontFamily}"`,
        ErrorCodes.FONT_NOT_SUPPORTED
      ));
    });
  } catch (error) {
    console.error(`Failed to load font ${fontFamily}:`, error);
    throw error;
  }
}; 