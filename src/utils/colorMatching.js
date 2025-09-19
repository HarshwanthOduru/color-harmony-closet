import { isNeutralColor } from './colorExtraction.js';

/**
 * Calculate the minimal angular difference between two hues on the color wheel
 * @param {number} h1 - First hue (0-360)
 * @param {number} h2 - Second hue (0-360)
 * @returns {number} Minimal angular difference (0-180)
 */
export const hueDifference = (h1, h2) => {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
};

/**
 * Calculate color harmony score between two colors
 * @param {number[]} hsl1 - First color HSL [h, s, l]
 * @param {number[]} hsl2 - Second color HSL [h, s, l]
 * @param {boolean} isFormalContext - Whether this is for formal outfit suggestions
 * @returns {number} Harmony score
 */
export const calculateColorHarmony = (hsl1, hsl2, isFormalContext = false) => {
  const [h1, s1, l1] = hsl1;
  const [h2, s2, l2] = hsl2;
  
  let score = 0;
  const hueDistance = hueDifference(h1, h2);
  
  const isNeutral1 = isNeutralColor(hsl1);
  const isNeutral2 = isNeutralColor(hsl2);
  
  // Complementary colors (opposite on color wheel) - strong harmony
  if (hueDistance >= 150 && hueDistance <= 210) {
    score += 2;
  }
  // Analogous colors (close on color wheel) - gentle harmony
  else if (hueDistance <= 30) {
    score += 1;
  }
  
  // High contrast (light vs dark) adds harmony
  if ((l1 < 30 && l2 > 70) || (l2 < 30 && l1 > 70)) {
    score += 1;
  }
  
  // Neutral pairings
  if (isNeutral1 || isNeutral2) {
    if (isFormalContext) {
      score += 1; // Neutrals are preferred in formal context
    }
  }
  
  return score;
};

/**
 * Score an outfit combination based on color harmony rules
 * @param {Object[]} items - Array of wardrobe items with extracted colors
 * @param {boolean} isFormal - Whether this is for formal styling
 * @returns {Object} Scoring result with total score and explanation
 */
export const scoreOutfitCombination = (items, isFormal = false) => {
  if (items.length < 2) {
    return { score: 0, explanation: "Not enough items for scoring" };
  }
  
  let totalScore = 0;
  let harmonyDetails = [];
  let neutralCount = 0;
  let avgSaturation = 0;
  
  // Calculate pairwise scores and gather statistics
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1 = items[i];
      const item2 = items[j];
      
      const harmonyScore = calculateColorHarmony(item1.hsl, item2.hsl, isFormal);
      totalScore += harmonyScore;
      
      if (harmonyScore > 0) {
        const hueDistance = hueDifference(item1.hsl[0], item2.hsl[0]);
        if (hueDistance >= 150 && hueDistance <= 210) {
          harmonyDetails.push(`${item1.category} + ${item2.category}: complementary colors`);
        } else if (hueDistance <= 30) {
          harmonyDetails.push(`${item1.category} + ${item2.category}: analogous harmony`);
        }
        
        if (isNeutralColor(item1.hsl) || isNeutralColor(item2.hsl)) {
          harmonyDetails.push(`${item1.category} + ${item2.category}: neutral pairing`);
        }
      }
    }
    
    if (isNeutralColor(items[i].hsl)) {
      neutralCount++;
    }
    avgSaturation += items[i].hsl[1];
  }
  
  avgSaturation /= items.length;
  
  // Apply formal/casual preferences
  if (isFormal) {
    // Formal prefers neutrals and lower saturation
    totalScore += neutralCount * 0.5;
    if (avgSaturation > 55) {
      totalScore -= 1; // Penalize overly bright combinations in formal context
    }
  } else {
    // Casual allows bolder combinations
    if (avgSaturation > 40) {
      totalScore += 0.5; // Reward vibrant combinations in casual context
    }
  }
  
  // Generate human-readable explanation
  let explanation = generateOutfitExplanation(items, harmonyDetails, isFormal, neutralCount, avgSaturation);
  
  return {
    score: totalScore,
    explanation,
    details: {
      harmonyDetails,
      neutralCount,
      avgSaturation: Math.round(avgSaturation)
    }
  };
};

/**
 * Generate human-readable explanation for outfit combination
 * @param {Object[]} items - Wardrobe items
 * @param {string[]} harmonyDetails - Detailed harmony information
 * @param {boolean} isFormal - Formal context
 * @param {number} neutralCount - Number of neutral items
 * @param {number} avgSaturation - Average saturation
 * @returns {string} Human-readable explanation
 */
const generateOutfitExplanation = (items, harmonyDetails, isFormal, neutralCount, avgSaturation) => {
  const itemNames = items.map(item => `${item.hex} ${item.category.toLowerCase()}`);
  
  if (harmonyDetails.length === 0 && neutralCount === 0) {
    return `${itemNames.join(" + ")} — experimental color combination for ${isFormal ? 'formal' : 'casual'} wear`;
  }
  
  let explanation = "";
  
  if (neutralCount > 0) {
    explanation += neutralCount === items.length ? "All neutral palette" : `${neutralCount} neutral item${neutralCount > 1 ? 's' : ''} provide balance`;
  }
  
  if (harmonyDetails.length > 0) {
    const primaryHarmony = harmonyDetails[0];
    if (explanation) explanation += "; ";
    explanation += primaryHarmony.split(': ')[1];
  }
  
  if (isFormal && neutralCount > 0) {
    explanation += " — professional and sophisticated";
  } else if (!isFormal && avgSaturation > 50) {
    explanation += " — vibrant and expressive";
  }
  
  return `${itemNames.join(" + ")} — ${explanation}`;
};

/**
 * Generate outfit suggestions from wardrobe items
 * @param {Object} wardrobe - Wardrobe object with categorized items
 * @param {boolean} isFormal - Whether to generate formal outfits
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Object[]} Array of outfit suggestions
 */
export const generateOutfitSuggestions = (wardrobe, isFormal = false, maxSuggestions = 3) => {
  const { tops = [], bottoms = [], footwear = [], accessories = [] } = wardrobe;
  
  if (tops.length === 0 && bottoms.length === 0) {
    return [];
  }
  
  const suggestions = [];
  const maxCandidates = 200;
  let attempts = 0;
  
  // Generate random combinations
  while (suggestions.length < maxSuggestions && attempts < maxCandidates) {
    attempts++;
    
    const combination = [];
    
    // Always try to include a top if available
    if (tops.length > 0) {
      combination.push(tops[Math.floor(Math.random() * tops.length)]);
    }
    
    // Always try to include a bottom if available
    if (bottoms.length > 0) {
      combination.push(bottoms[Math.floor(Math.random() * bottoms.length)]);
    }
    
    // Optionally add footwear
    if (footwear.length > 0 && Math.random() > 0.3) {
      combination.push(footwear[Math.floor(Math.random() * footwear.length)]);
    }
    
    // Optionally add accessories
    if (accessories.length > 0 && Math.random() > 0.5) {
      combination.push(accessories[Math.floor(Math.random() * accessories.length)]);
    }
    
    // Skip if we don't have enough items
    if (combination.length < 2) continue;
    
    // Score the combination
    const scoring = scoreOutfitCombination(combination, isFormal);
    
    // Check if this combination already exists
    const combinationIds = combination.map(item => item.id).sort().join('-');
    const exists = suggestions.some(suggestion => 
      suggestion.items.map(item => item.id).sort().join('-') === combinationIds
    );
    
    if (!exists) {
      suggestions.push({
        id: `outfit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items: combination,
        score: scoring.score,
        explanation: scoring.explanation,
        details: scoring.details,
        style: isFormal ? 'formal' : 'casual',
        timestamp: Date.now()
      });
    }
  }
  
  // Sort by score and return top suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);
};