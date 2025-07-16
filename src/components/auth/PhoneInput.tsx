import { Country } from '@/hooks/useCountries';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountry: Country | null;
  disabled?: boolean;
  error?: string;
}

export const PhoneInput = ({
  value,
  onChange,
  selectedCountry,
  disabled = false,
  error
}: PhoneInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, ''); // Only allow digits
    onChange(newValue);
  };

  const getPlaceholder = () => {
    if (!selectedCountry) return 'Enter phone number';
    return `Enter ${selectedCountry.phoneLength || 10} digits`;
  };

  return (
    <div className="flex-[2]">
      <label 
        className="block text-sm font-medium mb-2"
        style={{ color: 'var(--primary-text)' }}
      >
        Phone Number
      </label>
      <input
        type="tel"
        className="w-full px-3 py-3 border rounded-lg outline-none transition-colors disabled:cursor-not-allowed focus:outline-none"
        style={{
          backgroundColor: disabled ? 'var(--disabled-bg)' : 'var(--card-bg)',
          borderColor: error ? 'var(--error)' : 'var(--border)',
          color: 'var(--primary-text)',
          height: '48px', // Match CountryCodeSelector height
        }}
        placeholder={getPlaceholder()}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={selectedCountry?.phoneLength || 15}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--error-text)' }}>{error}</p>
      )}
      {selectedCountry && !error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--secondary-text)' }}>
          Enter {selectedCountry.phoneLength || 10} digits for {selectedCountry.name}
        </p>
      )}
    </div>
  );
}; 