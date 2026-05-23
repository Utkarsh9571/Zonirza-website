'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldCheck, Lock } from 'lucide-react';
import { StepIndicator } from '../../../../components/finance/onboarding/StepIndicator';
import { PersonalDetailsStep } from '../../../../components/finance/onboarding/PersonalDetailsStep';
import { NomineeDetailsStep } from '../../../../components/finance/onboarding/NomineeDetailsStep';
import { PaymentStep } from '../../../../components/finance/onboarding/PaymentStep';
import { SubscriptionSummary } from '../../../../components/finance/onboarding/SubscriptionSummary';

// Mock data, in production this should be fetched from URL params or a finance state store
export default function OnboardingFlow({ params }: { params: Promise<{ planType: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Form Data State
  const [personalDetails, setPersonalDetails] = useState({
    email: '',
    mobile: '',
    fullName: '',
    pincode: '',
    address: '',
    locality: '',
    landmark: '',
    city: '',
    state: ''
  });

  const [nomineeDetails, setNomineeDetails] = useState({
    fullName: '',
    relationship: 'Spouse',
    nationality: 'Indian'
  });

  // Example subscription data
  const monthlyAmount = 2000;
  const planType = resolvedParams.planType === 'gold_reserve' ? 'Gold Reserve Plan' : 'Gold Mine 10+1 Plan';

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userEmail = session.user.email;
      const userName = session.user.name;
      setPersonalDetails(prev => ({
        ...prev,
        email: userEmail || prev.email,
        fullName: userName || prev.fullName
      }));
    }
  }, [status, session]);

  if (!isClient) return null;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-brand-bg pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Strip */}
        <div className="flex justify-between items-center py-6 border-b border-brand-text/10 dark:border-white/10 mt-8 mb-8">
          <h1 className="text-2xl font-serif text-brand-text dark:text-brand-gold">ZONIRAZ</h1>
          
          <div className="hidden md:block flex-1 max-w-2xl px-12">
            <StepIndicator currentStep={currentStep} />
          </div>

          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-500 font-bold">
            <Lock size={16} />
            100% SECURE
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Forms */}
          <div className="flex-1">
            {currentStep === 1 && (
              <PersonalDetailsStep 
                data={personalDetails} 
                onChange={setPersonalDetails} 
                onNext={handleNext} 
              />
            )}
            {currentStep === 2 && (
              <NomineeDetailsStep 
                data={nomineeDetails} 
                onChange={setNomineeDetails} 
                onNext={handleNext} 
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <PaymentStep 
                personalDetails={personalDetails}
                nomineeDetails={nomineeDetails}
                planType={planType}
                monthlyAmount={monthlyAmount}
                onBack={handleBack}
              />
            )}
          </div>

          {/* Right Column: Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24">
              <SubscriptionSummary planType={planType} monthlyAmount={monthlyAmount} />
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mt-8 opacity-60">
                <div className="flex flex-col items-center text-center gap-2 p-4 border border-brand-text/10 rounded-xl">
                  <ShieldCheck size={24} className="text-brand-gold" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Trusted by Investors</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 border border-brand-text/10 rounded-xl">
                  <Lock size={24} className="text-brand-gold" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Transparent Pricing</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
