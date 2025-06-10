
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Clock } from 'lucide-react'; 

// SVG for WhatsApp icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.33 3.43 16.79L2.05 22L7.31 20.62C8.72 21.33 10.33 21.72 12.04 21.72C17.5 21.72 21.95 17.27 21.95 11.81C21.95 6.35 17.5 2 12.04 2M12.04 3.64C16.57 3.64 20.27 7.34 20.27 11.81C20.27 16.28 16.57 19.98 12.04 19.98C10.53 19.98 9.11 19.59 7.89 18.9L7.47 18.67L4.8 19.44L5.58 16.87L5.32 16.41C4.56 15.04 4.14 13.48 4.14 11.91C4.14 7.44 7.84 3.74 12.04 3.64M17.46 14.85C17.18 15.28 16.17 15.89 15.68 15.98C15.19 16.07 14.69 16.16 12.91 15.46C10.77 14.63 9.23 12.76 9.03 12.5C8.82 12.24 7.94 11.03 7.94 10.04C7.94 9.06 8.38 8.66 8.6 8.44C8.82 8.22 9.14 8.15 9.36 8.15C9.54 8.15 9.71 8.15 9.85 8.16C10.03 8.17 10.17 8.18 10.34 8.49C10.58 8.91 11.06 10.11 11.15 10.25C11.24 10.39 11.29 10.58 11.15 10.76C11.01 10.94 10.92 11.03 10.74 11.25C10.56 11.47 10.38 11.61 10.25 11.75C10.11 11.89 9.95 12.09 10.14 12.41C10.32 12.73 11.08 13.62 11.96 14.36C13.08 15.29 13.94 15.52 14.21 15.52C14.48 15.52 14.98 15.47 15.21 15.2C15.49 14.88 15.83 14.44 16.01 14.21C16.19 13.98 16.41 13.94 16.64 14.03C16.86 14.12 17.84 14.63 18.12 14.77C18.4 14.91 18.54 15 18.63 15.1C18.72 15.19 18.45 15.57 17.46 14.85Z" />
  </svg>
);

interface CurrencyRates {
  USD: number | string;
  EUR: number | string;
  JOD: number | string;
}

const Header = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates>({
    USD: 'جارٍ...',
    EUR: 'جارٍ...',
    JOD: 'جارٍ...',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jerusalem",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    const fetchCurrencyRates = async () => {
      try {
        const apiKey = "rJazBtzJrIw_PUmHUCjC8OpnWM3pluKV"; 
        const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=ILS&currencies=USD,EUR,JOD`);
        
        if (!response.ok) {
            if (response.status === 429) {
                console.warn(`CURRENCY API ERROR: Rate limit exceeded (429) for API key "${apiKey}". This means the free tier quota might be exhausted. Please check your account at currencyapi.com or consider using a different key. Displaying N/A.`);
            } else if (response.status === 401 || response.status === 403) {
                console.error(`CURRENCY API ERROR: Unauthorized (status ${response.status}) for API key "${apiKey}". The API key might be invalid or disabled. Please verify your API key. Displaying N/A.`);
            }
             else {
                console.error(`CURRENCY API ERROR: Request failed with status ${response.status}. URL: ${response.url}. Please check network and API status. Displaying N/A.`);
            }
            setCurrencyRates({ USD: "N/A", EUR: "N/A", JOD: "N/A" });
            return; 
        }

        const data = await response.json();
        if (data && data.data && data.data.USD && data.data.EUR && data.data.JOD &&
            typeof data.data.USD.value === 'number' && 
            typeof data.data.EUR.value === 'number' &&
            typeof data.data.JOD.value === 'number') {
          setCurrencyRates({
            USD: (1 / data.data.USD.value).toFixed(2),
            EUR: (1 / data.data.EUR.value).toFixed(2),
            JOD: (1 / data.data.JOD.value).toFixed(2),
          });
        } else {
          console.error("Error in currency data structure, missing currency values, or API error:", data);
          setCurrencyRates({ USD: "N/A", EUR: "N/A", JOD: "N/A" });
        }
      } catch (error) {
        console.error("Error fetching currency rates (network issue or CORS):", error);
        setCurrencyRates({ USD: "N/A", EUR: "N/A", JOD: "N/A" });
      }
    };

    fetchCurrencyRates();
    const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;
    const currencyTimerId = setInterval(fetchCurrencyRates, TEN_DAYS_IN_MS); 

    return () => {
      clearInterval(timerId);
      clearInterval(currencyTimerId);
    }
  }, []);

  return (
    <header className="bg-header-bg text-header-fg py-3 px-4 md:px-6 shadow-header-footer">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-y-3">
        
        {/* Right Section: Logo & Titles (RTL) */}
        <div className="flex items-center">
          <Image 
            src="https://i.imgur.com/79bO3U2.jpg" 
            alt="شعار الموقع" 
            width={70} 
            height={70} 
            className="rounded-full border-2 border-app-gold"
            data-ai-hint="logo construction"
            priority
          />
          <div className="mr-3 text-right">
            <h1 className="text-app-red text-2xl md:text-3xl font-bold">
              المحترف لحساب الكميات
            </h1>
            <p className="text-sm text-gray-300">الحديد والباطون للأبنية الإنشائية</p>
          </div>
        </div>
        
        {/* Left Section: Info (Time, Currency, Social) (RTL) */}
        <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-3">
          <div className="bg-header-info-bg text-white px-3 py-1.5 rounded-lg text-sm shadow-md flex items-center gap-2">
            <Clock size={16} className="flex-shrink-0" />
            <span className="tabular-nums min-w-[12ch] text-left">{currentTime || 'Loading...'}</span>
          </div>

          <div className="bg-header-info-bg text-white px-3 py-1.5 rounded-lg text-sm shadow-md">
            <span className="text-xs block mb-0.5 text-gray-300">أسعار العملات:</span>
            <div className="flex items-center gap-2">
              <span className="bg-currency-jod px-2 py-0.5 rounded-full text-xs text-gray-900 font-semibold">JOD: {currencyRates.JOD}</span>
              <span className="bg-currency-eur px-2 py-0.5 rounded-full text-xs text-gray-900 font-semibold">EUR: {currencyRates.EUR}</span>
              <span className="bg-currency-usd px-2 py-0.5 rounded-full text-xs text-gray-900 font-semibold">USD: {currencyRates.USD}</span>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <Link href="https://wa.me/970595528080" target="_blank" rel="noopener noreferrer" 
                  className="p-2 rounded-full bg-social-whatsapp text-white hover:opacity-80 transition-opacity">
              <WhatsAppIcon className="h-5 w-5" />
            </Link>
            <Link href="https://www.instagram.com/a.w.samarah3/" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-social-instagram text-white hover:opacity-80 transition-opacity">
              <Instagram size={20} />
            </Link>
            <Link href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" 
                  className="p-2 rounded-full bg-social-facebook text-white hover:opacity-80 transition-opacity">
              <Facebook size={20} />
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
    
