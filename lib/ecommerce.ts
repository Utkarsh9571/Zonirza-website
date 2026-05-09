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
