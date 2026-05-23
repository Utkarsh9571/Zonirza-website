import React from 'react';

interface NomineeDetailsProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const NomineeDetailsStep: React.FC<NomineeDetailsProps> = ({ data, onChange, onNext, onBack }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-8 rounded-xl border border-brand-text/10 dark:border-white/10 shadow-soft animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="mb-8 border-b border-brand-text/10 dark:border-white/10 pb-4">
        <h2 className="text-xl font-bold text-brand-text dark:text-white mb-2">Nominee Details</h2>
        <p className="text-sm text-brand-text/60 dark:text-white/60">Enter details of the person who can redeem the plan benefits in case of unforeseen circumstances.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
             type="text" 
             name="fullName"
             value={data.fullName}
             onChange={handleChange}
             placeholder="Nominee's Full Name"
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
          />
          <select 
             name="relationship"
             value={data.relationship}
             onChange={handleChange}
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors appearance-none"
          >
             <option value="Spouse">Spouse</option>
             <option value="Father">Father</option>
             <option value="Mother">Mother</option>
             <option value="Son">Son</option>
             <option value="Daughter">Daughter</option>
             <option value="Brother">Brother</option>
             <option value="Sister">Sister</option>
             <option value="Other">Other</option>
          </select>
          <select 
             name="nationality"
             value={data.nationality}
             onChange={handleChange}
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors appearance-none"
          >
             <option value="Indian">Indian</option>
             <option value="NRI">NRI</option>
             <option value="Other">Other</option>
          </select>
        </div>

        <div className="pt-6 border-t border-brand-text/5 dark:border-white/5 flex items-center justify-between">
          <p className="text-xs text-brand-text/50 dark:text-white/50 max-w-[200px] md:max-w-none">
            By clicking Next, I hereby acknowledge that nominee is above 18 years old.
          </p>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-brand-text/20 hover:border-brand-text text-brand-text dark:text-white dark:border-white/20 dark:hover:border-white font-bold tracking-wider rounded-md transition-colors"
            >
              BACK
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-[#E55A44] hover:bg-[#D44A34] text-white font-bold tracking-wider rounded-md transition-colors"
            >
              NEXT
            </button>
          </div>
        </div>
      </form>

    </div>
  );
};
