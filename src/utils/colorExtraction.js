import ColorThief from 'colorthief';

/**
 * Extract dominant color from an image using ColorThief
 * @param {HTMLImageElement} img - The image element
 * @returns {Promise<{rgb: number[], hex: string, hsl: number[]}>}
 */
export const extractDominantColor = async (img) => {
  return new Promise((resolve, reject) => {
    try {
      const colorThief = new ColorThief();
      
      // Ensure image is loaded
      if (img.complete) {
        const rgb = colorThief.getColor(img);
        const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        resolve({ rgb, hex, hsl });
      } else {
        img.onload = () => {
          const rgb = colorThief.getColor(img);
          const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
          const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
          resolve({ rgb, hex, hsl });
        };
        img.onerror = reject;
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Convert RGB to HEX
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} HEX color string
 */
export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Convert RGB to HSL
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number[]} HSL array [h, s, l] where h is 0-360, s and l are 0-100
 */
export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

/**
 * Check if a color is considered neutral (low saturation or specific color ranges)
 * @param {number[]} hsl - HSL array [h, s, l]
 * @returns {boolean}
 */
export const isNeutralColor = (hsl) => {
  const [h, s, l] = hsl;
  
  // Low saturation colors are neutral
  if (s < 12) return true;
  
  // Very light or very dark colors tend to be neutral
  if (l > 85 || l < 15) return true;
  
  // Beige/tan color range (30-60 degrees with moderate saturation)
  if (h >= 30 && h <= 60 && s < 40) return true;
  
  return false;
};