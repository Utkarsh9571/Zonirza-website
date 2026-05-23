import React from 'react';
import { Mail, Phone, User } from 'lucide-react';

interface PersonalDetailsProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export const PersonalDetailsStep: React.FC<PersonalDetailsProps> = ({ data, onChange, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-8 rounded-xl border border-brand-text/10 dark:border-white/10 shadow-soft">
      <div className="mb-8 border-b border-brand-text/10 dark:border-white/10 pb-4">
        <h2 className="text-xl font-bold text-brand-text dark:text-white mb-2">Personal Details</h2>
        <p className="text-sm text-brand-text/60 dark:text-white/60">Kindly enter your personal details for the fields mentioned below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/40">
               <Mail size={18} />
             </div>
             <input 
               type="email" 
               name="email"
               value={data.email}
               onChange={handleChange}
               placeholder="Email address"
               required
               className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 pl-12 pr-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
             />
          </div>
          <div className="relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/40">
               <Phone size={18} />
             </div>
             <input 
               type="tel" 
               name="mobile"
               value={data.mobile}
               onChange={handleChange}
               placeholder="Mobile number"
               required
               className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 pl-12 pr-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
             />
          </div>
        </div>

        <div className="relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/40">
             <User size={18} />
           </div>
           <input 
             type="text" 
             name="fullName"
             value={data.fullName}
             onChange={handleChange}
             placeholder="Your Full Name"
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 pl-12 pr-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
           />
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
             type="text" 
             name="pincode"
             value={data.pincode}
             onChange={handleChange}
             placeholder="Pincode"
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
          />
          <input 
             type="text" 
             name="address"
             value={data.address}
             onChange={handleChange}
             placeholder="Apartment/House/Flat No."
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
          />
          <input 
             type="text" 
             name="locality"
             value={data.locality}
             onChange={handleChange}
             placeholder="Street/Colony/Area Name"
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
          />
          <input 
             type="text" 
             name="landmark"
             value={data.landmark}
             onChange={handleChange}
             placeholder="Landmark (Optional)"
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
          />
          <input 
             type="text" 
             name="city"
             value={data.city}
             onChange={handleChange}
             placeholder="City/District"
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors"
          />
          <select 
             name="state"
             value={data.state}
             onChange={handleChange}
             required
             className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold transition-colors appearance-none"
          >
             <option value="" disabled>Select State</option>
             <option value="Delhi">Delhi</option>
             <option value="Maharashtra">Maharashtra</option>
             <option value="Karnataka">Karnataka</option>
             <option value="Rajasthan">Rajasthan</option>
             {/* Add more states here */}
          </select>
        </div>

        <div className="pt-6 border-t border-brand-text/5 dark:border-white/5 flex items-center justify-between">
          <p className="text-xs text-brand-text/50 dark:text-white/50">
            By clicking Next, I hereby acknowledge that I am above 18 years old.
          </p>
          <button 
            type="submit"
            className="px-8 py-3 bg-[#E55A44] hover:bg-[#D44A34] text-white font-bold tracking-wider rounded-md transition-colors"
          >
            NEXT
          </button>
        </div>
      </form>

    </div>
  );
};
