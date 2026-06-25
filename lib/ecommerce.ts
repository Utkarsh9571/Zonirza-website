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
