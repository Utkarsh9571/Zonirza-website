import { useState, useEffect, useMemo } from 'react';
import { ProductConfiguration } from '@/lib/pricing';

export interface RuleResult {
  isRestricted: boolean;
  restrictionMessage: string | null;
  requiresConsultation: boolean;
  consultationMessage: string | null;
  surcharges: number;
}

export function useRulesEngine(product: any, configuration: ProductConfiguration): RuleResult {
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/rules/public')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRules(data.data);
        }
      })
      .catch(console.error);
  }, []);

  return useMemo(() => {
    let result: RuleResult = {
      isRestricted: false,
      restrictionMessage: null,
      requiresConsultation: false,
      consultationMessage: null,
      surcharges: 0,
    };

    if (!product || !configuration || rules.length === 0) return result;

    for (const rule of rules) {
      // 1. Check Scope
      let inScope = true;
      if (rule.scope.categories?.length > 0 && !rule.scope.categories.includes(product.category)) {
        inScope = false;
      }
      if (rule.scope.productIds?.length > 0 && !rule.scope.productIds.includes(product._id?.toString())) {
        inScope = false;
      }

      if (!inScope) continue;

      // 2. Check Trigger
      // Rule triggers if ALL non-empty trigger arrays contain the selected configuration
      let isTriggered = true;
      
      const hasMetals = rule.trigger.metals?.length > 0;
      const hasPurities = rule.trigger.purities?.length > 0;
      const hasStones = rule.trigger.stones?.length > 0;
      const hasSizes = rule.trigger.sizes?.length > 0;

      // If a rule has NO triggers defined, it should arguably trigger for everything in scope, 
      // but usually we want at least one trigger condition. 
      // Let's say if no triggers are defined, it applies universally to the scope.
      if (!hasMetals && !hasPurities && !hasStones && !hasSizes) {
        isTriggered = true;
      } else {
        if (hasMetals && !rule.trigger.metals.includes(configuration.metal)) isTriggered = false;
        if (hasPurities && !rule.trigger.purities.includes(configuration.purity)) isTriggered = false;
        if (hasStones && configuration.stone && !rule.trigger.stones.includes(configuration.stone)) isTriggered = false;
        if (hasSizes && configuration.size && !rule.trigger.sizes.includes(configuration.size)) isTriggered = false;
        
        // If a property isn't selected but required by the rule, it doesn't trigger
        if (hasStones && !configuration.stone) isTriggered = false;
        if (hasSizes && !configuration.size) isTriggered = false;
      }

      if (!isTriggered) continue;

      // 3. Apply Result
      if (rule.type === 'restriction') {
        result.isRestricted = true;
        result.restrictionMessage = rule.result.message || 'This configuration is currently unavailable.';
      } else if (rule.type === 'consultation') {
        result.requiresConsultation = true;
        result.consultationMessage = rule.result.message || 'This unique combination requires a bespoke consultation.';
      } else if (rule.type === 'surcharge') {
        if (rule.result.surchargeType === 'percentage') {
          // It would be calculated against basePrice, but we just pass the percentage back 
          // Actually, we'd need base price. For simplicity, we just calculate it here if it's percentage of product basePrice
          result.surcharges += (product.basePrice * (rule.result.surcharge / 100));
        } else {
          result.surcharges += rule.result.surcharge;
        }
      }
    }

    return result;
  }, [product, configuration, rules]);
}
