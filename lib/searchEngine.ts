/**
 * Intelligent Search Engine
 * Parses raw text queries to extract intent (metals, stones, categories, styles).
 * Returns a MongoDB query object optimized for luxury jewelry discovery.
 */

const METALS = ['gold', 'silver', 'platinum', 'rose gold', 'white gold', 'yellow gold', '18k', '14k', '22k', '24k'];
const STONES = ['diamond', 'ruby', 'emerald', 'sapphire', 'pearl', 'moissanite', 'solitaire', 'polki', 'kundan'];
const CATEGORIES = ['ring', 'earring', 'necklace', 'bracelet', 'bangle', 'pendant', 'chain', 'mangalsutra'];
const STYLES = ['minimal', 'minimalist', 'bridal', 'wedding', 'daily', 'office', 'statement', 'vintage', 'classic', 'modern', 'casual', 'party'];

export interface SearchIntent {
  rawQuery: string;
  metals: string[];
  stones: string[];
  categories: string[];
  styles: string[];
  remainingTerms: string[];
}

export function parseSearchIntent(query: string): SearchIntent {
  const normalizedQuery = query.toLowerCase().trim();
  const intent: SearchIntent = {
    rawQuery: normalizedQuery,
    metals: [],
    stones: [],
    categories: [],
    styles: [],
    remainingTerms: []
  };

  let remainingText = normalizedQuery;

  // Extract multi-word terms first (like 'rose gold')
  if (remainingText.includes('rose gold')) {
    intent.metals.push('rose gold');
    remainingText = remainingText.replace('rose gold', ' ');
  }
  if (remainingText.includes('white gold')) {
    intent.metals.push('white gold');
    remainingText = remainingText.replace('white gold', ' ');
  }
  if (remainingText.includes('yellow gold')) {
    intent.metals.push('yellow gold');
    remainingText = remainingText.replace('yellow gold', ' ');
  }
  if (remainingText.includes('daily wear')) {
    intent.styles.push('daily wear');
    remainingText = remainingText.replace('daily wear', ' ');
  }

  const words = remainingText.split(/\s+/).filter(w => w.length > 0);

  words.forEach(word => {
    if (METALS.includes(word) && !intent.metals.includes(word)) {
      intent.metals.push(word);
    } else if (STONES.includes(word) && !intent.stones.includes(word)) {
      intent.stones.push(word);
    } else if (CATEGORIES.some(c => word.includes(c)) && !intent.categories.includes(word)) {
      // Handle plural gracefully (rings -> ring)
      const matchedCat = CATEGORIES.find(c => word.includes(c)) || word;
      intent.categories.push(matchedCat);
    } else if (STYLES.includes(word) && !intent.styles.includes(word)) {
      intent.styles.push(word);
    } else {
      intent.remainingTerms.push(word);
    }
  });

  return intent;
}

export function buildMongoQuery(intent: SearchIntent) {
  const andConditions: any[] = [];
  const orConditions: any[] = [];

  // If we detected specific categories, MUST match category or tags
  if (intent.categories.length > 0) {
    andConditions.push({
      $or: [
        { category: { $in: intent.categories.map(c => new RegExp(c, 'i')) } },
        { tags: { $in: intent.categories.map(c => new RegExp(c, 'i')) } },
        { name: { $in: intent.categories.map(c => new RegExp(c, 'i')) } }
      ]
    });
  }

  // If we detected metals, MUST match specs or tags or name
  if (intent.metals.length > 0) {
    const metalRegexList = intent.metals.map(m => new RegExp(m, 'i'));
    andConditions.push({
      $or: [
        { "specs.metal": { $in: metalRegexList } },
        { "configurableOptions.metals": { $in: metalRegexList } },
        { tags: { $in: metalRegexList } },
        { name: { $in: metalRegexList } }
      ]
    });
  }

  // If we detected stones
  if (intent.stones.length > 0) {
    const stoneRegexList = intent.stones.map(s => new RegExp(s, 'i'));
    andConditions.push({
      $or: [
        { "specs.stone": { $in: stoneRegexList } },
        { "configurableOptions.stones": { $in: stoneRegexList } },
        { tags: { $in: stoneRegexList } },
        { name: { $in: stoneRegexList } }
      ]
    });
  }

  // If we detected styles
  if (intent.styles.length > 0) {
    const styleRegexList = intent.styles.map(s => new RegExp(s, 'i'));
    andConditions.push({
      $or: [
        { tags: { $in: styleRegexList } },
        { description: { $in: styleRegexList } }
      ]
    });
  }

  // For remaining terms, fuzzy search across name, desc, tags
  if (intent.remainingTerms.length > 0) {
    const termRegex = new RegExp(intent.remainingTerms.join('|'), 'i');
    andConditions.push({
      $or: [
        { name: termRegex },
        { description: termRegex },
        { tags: { $in: [termRegex] } }
      ]
    });
  }

  // If no specific intent was detected, fallback to broad search on the raw query
  if (andConditions.length === 0) {
    const broadRegex = new RegExp(intent.rawQuery, 'i');
    return {
      isActive: true,
      $or: [
        { name: broadRegex },
        { category: broadRegex },
        { tags: { $in: [broadRegex] } },
        { "specs.metal": broadRegex }
      ]
    };
  }

  return {
    isActive: true,
    $and: andConditions
  };
}
