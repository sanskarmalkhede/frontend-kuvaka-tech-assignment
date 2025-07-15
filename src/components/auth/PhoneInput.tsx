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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number
      </label>
      <input
        type="tel"
        className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={getPlaceholder()}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={selectedCountry?.phoneLength || 15}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {selectedCountry && !error && (
        <p className="mt-1 text-xs text-gray-500">
          Enter {selectedCountry.phoneLength || 10} digits for {selectedCountry.name}
        </p>
      )}
    </div>
  );
}; 