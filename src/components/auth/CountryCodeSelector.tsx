import { useState, useRef, useEffect } from 'react';
import { Country } from '@/hooks/useCountries';

interface CountryCodeSelectorProps {
  countries: Country[];
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
  disabled?: boolean;
}

export const CountryCodeSelector = ({
  countries,
  selectedCountry,
  onSelectCountry,
  disabled = false
}: CountryCodeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    onSelectCountry(country);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Country Code
      </label>
      {/* Custom Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-left flex items-center justify-between text-gray-900"
      >
        <div className="flex items-center space-x-2">
          {selectedCountry ? (
            <>
              <img 
                src={selectedCountry.flag} 
                alt={`flag`}
                className="w-5 h-4 object-cover rounded"
              />
              <span className="text-sm text-gray-900">{selectedCountry.dialCode}</span>
            </>
          ) : (
            <span className="text-gray-500">Select Country</span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleCountrySelect(country)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 focus:outline-none focus:bg-gray-50 text-gray-900"
            >
              <img 
                src={country.flag} 
                alt={`flag`}
                className="w-5 h-4 object-cover rounded"
              />
              <span className="text-sm text-gray-900">{country.dialCode}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 