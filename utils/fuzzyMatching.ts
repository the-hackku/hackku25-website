import levenshtein from "fast-levenshtein";

// Function to calculate similarity confidence
function getSimilarityScore(input: string, target: string): number {
  const distance = levenshtein.get(input, target);
  return 1 - distance / Math.max(input.length, target.length);
}

// Fuzzy match with confidence scoring (for frontend processing)
export function fuzzyMatchWithConfidence(input: string, categories: string[]) {
  let bestMatch = "Other";
  let highestConfidence = 0;

  for (const category of categories) {
    const confidence = getSimilarityScore(input, category);
    if (confidence > highestConfidence) {
      highestConfidence = confidence;
      bestMatch = category;
    }
  }

  return { category: bestMatch, confidence: highestConfidence };
}
