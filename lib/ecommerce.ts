/**
 * Production-Ready Ecommerce Validation Logic
 * Handles product configuration completeness and order-ready state.
 */

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

/**
 * Validates whether all required configuration options for a product are selected.
 */
export function validateProductConfiguration(
  product: any,
  selectedOptions: Record<string, string>
): ValidationResult {
  const missingFields: string[] = [];
  
  // 1. Mandatory Core Options for Jewelry
  const requiredKeys = ['metal', 'purity'];
  
  // 2. Conditional Mandatory Options based on Product Type
  if (product.category?.toLowerCase() === 'rings' || product.category?.toLowerCase() === 'ring') {
    requiredKeys.push('size');
  }
  
  // 3. Dynamic Required Options from product.configurableOptions
  if (product.configurableOptions?.stones?.length > 0) {
    requiredKeys.push('stone');
  }

  // 4. Custom Color Request
  if (selectedOptions.isCustomColor) {
    requiredKeys.push('customColorNotes');
  }

  // Check each required key against selectedOptions
  requiredKeys.forEach(key => {
    if (!selectedOptions[key] || selectedOptions[key] === '' || selectedOptions[key] === 'None') {
      missingFields.push(key);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Checks if a specific option key is currently missing from the selection.
 */
export function isFieldMissing(key: string, missingFields: string[]): boolean {
  return missingFields.includes(key);
}

/**
 * Resolves the default metal to be displayed for a product across all storefront components.
 * Priority:
 * 1. Customer-applied metal filter (?metal=rose-gold)
 * 2. Product-level defaultMetal
 * 3. Legacy product-level defaultColor
 * 4. System default (yellow-gold)
 * 5. First available metal
 */
export function resolveDefaultMetal(
  product: any,
  activeFilters?: { metal?: string } | null
): string {
  if (!product) return 'yellow-gold';

  const configOptions = product.configurableOptions || {};
  const metals: string[] = configOptions.metals?.length ? configOptions.metals : ['White Gold', 'Rose Gold', 'Yellow Gold'];

  // Normalize string for comparison
  const normalize = (m: string) => m.toLowerCase().replace(/\s+/g, '-');
  
  // 1. Customer filter
  if (activeFilters?.metal) {
    return activeFilters.metal;
  }

  // 2. Product defaultMetal
  if (product.defaultMetal) {
    return normalize(product.defaultMetal);
  }

  // 3. Legacy defaultColor
  if (product.defaultColor) {
    return normalize(product.defaultColor);
  }

  // 4. System default 'yellow-gold'
  const normalizedMetals = metals.map(normalize);
  if (normalizedMetals.includes('yellow-gold')) {
    return 'yellow-gold';
  }

  // 5. Fallback to first available metal
  if (normalizedMetals.length > 0) {
    return normalizedMetals[0];
  }

  return 'yellow-gold';
}

/**
 * Shared Default Product Configuration Engine
 * Single source of truth for default metal, purity, size, and stone selections.
 */
export function sharedDefaultProductConfiguration(
  product: any,
  activeFilters?: { metal?: string } | null
): {
  metal: string;
  purity: string;
  size: string;
  stone: string;
} {
  if (!product) {
    return { metal: 'yellow-gold', purity: '18K', size: '', stone: 'None' };
  }

  const configOptions = product.configurableOptions || {};
  
  // Resolve metals, purities, sizes, and stones
  const metals: string[] = configOptions.metals?.length ? configOptions.metals : ['White Gold', 'Rose Gold', 'Yellow Gold'];
  const purities: string[] = product.goldPurityOptions?.length 
    ? product.goldPurityOptions 
    : (configOptions.purities?.length ? configOptions.purities : ['18K', '14K', '9K']);
  const sizes: string[] = configOptions.sizes?.length ? configOptions.sizes : ['7', '8', '9', '10', '11'];
  
  const mapLegacyStones = (stonesArr: string[]) => {
    const mapping: Record<string, string> = {
      'VVS1': 'EF-VVS',
      'VS1': 'GH-VS',
      'SI1': 'IJ-SI',
      'DIAMOND STANDARD': 'Diamond-Standard',
      'DIAMOND-STANDARD': 'Diamond-Standard',
    };
    return stonesArr.map((s: string) => mapping[s.toUpperCase()] || mapping[s] || s);
  };
  
  const rawStones = configOptions.stones?.length ? configOptions.stones : ['EF-VVS', 'GH-VS', 'IJ-SI', 'Diamond-Standard'];
  const stones = mapLegacyStones(rawStones);

  // Initialize defaults
  const initialConfig = {
    metal: resolveDefaultMetal(product, activeFilters),
    purity: purities.includes('18K') ? '18K' : (purities[0] || '18K'),
    size: product.defaultSize || '',
    stone: (product.jewelryType === 'gold' || stones.length === 0) ? 'None' : stones[0],
  };

  // Default Size for Rings/Bangles/Chains/Bracelets if not specified
  if (!initialConfig.size) {
    const category = (product.category || '').toLowerCase();
    if (category.includes('ring')) {
      initialConfig.size = sizes.includes('12') ? '12' : (sizes.includes('7') ? '7' : sizes[0]); 
    } else if (category.includes('chain') || category.includes('necklace') || category.includes('mangalsutra')) {
      initialConfig.size = sizes.includes('20') ? '20' : sizes[0];
    } else if (category.includes('bracelet') || category.includes('anklet')) {
      initialConfig.size = sizes.includes('M') ? 'M' : (sizes.includes('Medium') ? 'Medium' : sizes[0]);
    } else if (category.includes('bangle')) {
      initialConfig.size = sizes.includes('2.4') ? '2.4' : sizes[0]; 
    }
  }

  return initialConfig;
}
