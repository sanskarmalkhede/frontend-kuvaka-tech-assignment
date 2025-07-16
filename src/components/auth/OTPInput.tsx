import { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const OTPInput = ({
  value,
  onChange,
  disabled = false,
  error
}: OTPInputProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Update internal state when value prop changes
    const otpArray = value.split('').slice(0, 6);
    while (otpArray.length < 6) {
      otpArray.push('');
    }
    setOtp(otpArray);
  }, [value]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    
    // Update parent component
    onChange(newOtp.join(''));
    
    // Move to next input if digit is entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus on the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="space-y-3">
      <label 
        className="block text-sm font-medium"
        style={{ color: 'var(--primary-text)' }}
      >
        Enter OTP
      </label>
      <div className="flex space-x-2 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg outline-none transition-colors disabled:cursor-not-allowed focus:outline-none"
            style={{
              backgroundColor: disabled ? 'var(--disabled-bg)' : 'var(--card-bg)',
              borderColor: error ? 'var(--error)' : 'var(--border)',
              color: 'var(--primary-text)',
            }}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-center" style={{ color: 'var(--error-text)' }}>{error}</p>
      )}
      <p className="text-xs text-center" style={{ color: 'var(--secondary-text)' }}>
        Enter the 6-digit code sent to your phone
      </p>
    </div>
  );
}; 