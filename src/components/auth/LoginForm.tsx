'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { useCountries, Country } from '@/hooks/useCountries';
import { createLoginSchema, LoginFormData, otpSchema } from '@/lib/validation';
import { CountryCodeSelector } from './CountryCodeSelector';
import { PhoneInput } from './PhoneInput';
import { OTPInput } from './OTPInput';
import { LoadingSkeleton } from './LoadingSkeleton';

export const LoginForm = () => {
  const router = useRouter();
  const { countries, loading: countriesLoading, error: countriesError } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(selectedCountry)),
    defaultValues: {
      countryCode: '',
      phone: '',
      otp: ''
    }
  });

  const phone = watch('phone');
  const otp = watch('otp');

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setValue('countryCode', country.dialCode);
  };

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!selectedCountry || !phone) {
      toast.error('Please select a country and enter your phone number');
      return;
    }

    // Validate phone number for selected country
    const phoneSchema = createLoginSchema(selectedCountry);
    const phoneValidation = phoneSchema.safeParse({
      countryCode: selectedCountry.dialCode,
      phone: phone
    });

    if (!phoneValidation.success) {
      toast.error(phoneValidation.error.issues[0].message);
      return;
    }

    setIsSendingOtp(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsOtpSent(true);
      setIsSendingOtp(false);
      setCountdown(5);
      toast.success('OTP sent successfully!');
      
      // Enable OTP input after 10 seconds
      setTimeout(() => {
        setIsOtpEnabled(true);
      }, 5000);
    }, 1000);
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      // Validate OTP
      const otpValidation = otpSchema.safeParse({ otp });
      
      if (!otpValidation.success) {
        toast.error('Invalid OTP. Please try again.');
        setIsVerifyingOtp(false);
        return;
      }

      // Store user data in localStorage
      const userData = {
        country: selectedCountry?.name,
        countryCode: selectedCountry?.dialCode,
        phone: phone
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Show success toast
      toast.success('Login successful!');
      
      // Reset form
      reset();
      setIsVerifyingOtp(false);
      
    } catch (error) {
      toast.error('Verification failed. Please try again.');
      setIsVerifyingOtp(false);
    }
  };

  // Handle form submission (not used in this flow)
  const onSubmit = (data: LoginFormData) => {
    console.log('Form submitted:', data);
  };

  if (countriesLoading) {
    return <LoadingSkeleton />;
  }

  if (countriesError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load countries</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Country Code and Phone Input */}
      <div className="flex space-x-3">
        <CountryCodeSelector
          countries={countries}
          selectedCountry={selectedCountry}
          onSelectCountry={handleCountrySelect}
          disabled={isSendingOtp || isVerifyingOtp}
        />
        <PhoneInput
          value={phone}
          onChange={(value) => setValue('phone', value)}
          selectedCountry={selectedCountry}
          disabled={isSendingOtp || isVerifyingOtp}
          error={errors.phone?.message}
        />
      </div>

      {/* Send OTP Button */}
      {!isOtpSent && (
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={isSendingOtp || !selectedCountry || !phone}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSendingOtp ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending OTP...</span>
            </>
          ) : (
            <span>Send OTP</span>
          )}
        </button>
      )}

      {/* OTP Input Section */}
      {isOtpSent && (
        <div className="space-y-4">
          <OTPInput
            value={otp || ''}
            onChange={(value) => setValue('otp', value)}
            disabled={!isOtpEnabled || isVerifyingOtp}
            error={errors.otp?.message}
          />
          
          {/* Countdown or Enable Message */}
          {countdown > 0 && (
            <p className="text-sm text-gray-500 text-center">
              OTP input will be enabled in {countdown} seconds
            </p>
          )}
          
          {/* Verify OTP Button */}
          {isOtpEnabled && (
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp || !otp || otp.length !== 6}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isVerifyingOtp ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify OTP</span>
              )}
            </button>
          )}
        </div>
      )}
    </form>
  );
}; 