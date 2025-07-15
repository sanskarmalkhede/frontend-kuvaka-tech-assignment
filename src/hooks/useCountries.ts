import { useState, useEffect } from 'react';

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  phoneLength?: number;
}

export interface CountryApiResponse {
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  cca2: string;
}

// Common phone number lengths for major countries
const PHONE_LENGTHS: Record<string, number> = {
  'US': 10, 'CA': 10, 'GB': 11, 'IN': 10, 'AU': 9, 'DE': 11, 'FR': 10,
  'JP': 10, 'CN': 11, 'BR': 11, 'MX': 10, 'IT': 10, 'ES': 9, 'RU': 10,
  'KR': 11, 'ID': 12, 'TR': 10, 'SA': 9, 'AE': 9, 'SG': 8, 'MY': 10,
  'TH': 9, 'VN': 10, 'PH': 10, 'PK': 10, 'BD': 11, 'EG': 10, 'ZA': 9,
  'NG': 10, 'KE': 10, 'GH': 10, 'AR': 10, 'CL': 9, 'CO': 10, 'PE': 9,
  'UY': 8, 'VE': 10, 'EC': 9, 'BO': 8, 'PY': 9, 'NL': 9, 'BE': 9,
  'CH': 9, 'AT': 11, 'SE': 9, 'NO': 8, 'DK': 8, 'FI': 9, 'PL': 9,
  'CZ': 9, 'HU': 9, 'PT': 9, 'GR': 10, 'IE': 9, 'IL': 9, 'JO': 9,
  'LB': 8, 'KW': 8, 'QA': 8, 'BH': 8, 'OM': 8, 'LK': 10, 'NP': 10,
  'MM': 9, 'KH': 9, 'LA': 10, 'UZ': 9, 'KZ': 10, 'UA': 9, 'BY': 9,
  'LT': 8, 'LV': 8, 'EE': 8, 'HR': 9, 'SI': 8, 'SK': 9, 'RO': 10,
  'BG': 9, 'RS': 9, 'BA': 8, 'MK': 8, 'AL': 9, 'MT': 8, 'CY': 8,
  'LU': 9, 'IS': 7, 'MC': 8, 'AD': 6, 'SM': 10, 'VA': 10, 'LI': 7
};

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd');
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const data: CountryApiResponse[] = await response.json();
        
        const parsedCountries: Country[] = data
          .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
          .map(country => ({
            name: country.name.common,
            code: country.cca2,
            dialCode: country.idd.root + (country.idd.suffixes[0] || ''),
            flag: country.flags.png,
            phoneLength: PHONE_LENGTHS[country.cca2] || 10
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(parsedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}; 