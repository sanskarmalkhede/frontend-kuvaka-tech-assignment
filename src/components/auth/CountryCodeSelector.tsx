import { useState, useRef, useEffect } from 'react';
import { useCountries, Country } from '@/hooks/useCountries';

interface CountryCodeSelectorProps {
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
  disabled?: boolean;
}

export const CountryCodeSelector = ({
  selectedCountry,
  onCountrySelect,
  disabled = false
}: CountryCodeSelectorProps) => {
  const { countries } = useCountries();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country: Country) => {
    onCountrySelect(country);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 relative" ref={dropdownRef}>
      <label 
        className="block text-sm font-medium mb-2"
        style={{ color: 'var(--primary-text)' }}
      >
        Country Code
      </label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-3 border rounded-lg outline-none transition-colors disabled:cursor-not-allowed text-left flex items-center justify-between space-x-2 focus:outline-none"
        style={{
          backgroundColor: disabled ? 'var(--disabled-bg)' : 'var(--card-bg)',
          borderColor: 'var(--border)',
          color: 'var(--primary-text)',
        }}
      >
        <div className="flex items-center space-x-2">
          {selectedCountry ? (
            <>
              <img 
                src={selectedCountry.flag} 
                alt={`flag`}
                className="w-5 h-4 object-cover rounded"
              />
              <span className="text-sm" style={{ color: 'var(--primary-text)' }}>
                {selectedCountry.dialCode}
              </span>
            </>
          ) : (
            <span className="text-sm" style={{ color: 'var(--secondary-text)' }}>
              Select Country
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--secondary-text)' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Dropdown Options */}
      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-full border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border)',
          }}
        >
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleCountrySelect(country)}
              className="w-full px-3 py-2 text-left transition-colors flex items-center space-x-2 outline-none focus:outline-none"
              style={{ color: 'var(--primary-text)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <img 
                src={country.flag} 
                alt={`flag`}
                className="w-5 h-4 object-cover rounded"
              />
              <span className="text-sm" style={{ color: 'var(--primary-text)' }}>
                {country.dialCode}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 