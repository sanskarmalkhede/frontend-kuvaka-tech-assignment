import { z } from 'zod';
import { Country } from '@/hooks/useCountries';

export const createLoginSchema = (selectedCountry: Country | null) => {
  return z.object({
    countryCode: z.string().min(1, 'Please select a country'),
    phone: z.string()
      .min(1, 'Phone number is required')
      .regex(/^\d+$/, 'Phone number must contain only digits')
      .refine((val) => {
        if (!selectedCountry) return true;
        const expectedLength = selectedCountry.phoneLength || 10;
        return val.length === expectedLength;
      }, {
        message: selectedCountry 
          ? `Phone number must be ${selectedCountry.phoneLength || 10} digits for ${selectedCountry.name}`
          : 'Invalid phone number length'
      }),
    otp: z.string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d+$/, 'OTP must contain only digits')
      .optional()
  });
};

export const otpSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits')
    .refine((val) => val === '123456', 'Invalid OTP. Please try again.')
});

export type LoginFormData = {
  countryCode: string;
  phone: string;
  otp?: string;
};

export const validatePhoneForCountry = (phone: string, country: Country | null): boolean => {
  if (!country) return false;
  const expectedLength = country.phoneLength || 10;
  return phone.length === expectedLength && /^\d+$/.test(phone);
}; 