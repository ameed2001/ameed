
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react'; // Added Linkedin as an example, adjust as needed

interface CurrencyRates {
  USD: number | string;
  EUR: number | string;
  JOD: number | string;
}

const Header = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates>({
    USD: 'جارٍ التحديث...',
    EUR: 'جارٍ التحديث...',
    JOD: 'جارٍ التحديث...',
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
      setCurrentTime(new Intl.DateTimeFormat("ar-EG", options).format(now));
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    const fetchCurrencyRates = async () => {
      try {
        const apiKey = "e256bd321903a099d3e8e81e"; 
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/ILS`);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data.result === "success" && data.conversion_rates) {
          setCurrencyRates({
            USD: (1 / data.conversion_rates.USD).toFixed(3),
            EUR: (1 / data.conversion_rates.EUR).toFixed(3),
            JOD: (1 / data.conversion_rates.JOD).toFixed(3),
          });
        } else {
          console.error("Error in currency data:", data.result, data['error-type']);
          setCurrencyRates({ USD: "خطأ", EUR: "خطأ", JOD: "خطأ" });
        }
      } catch (error) {
        console.error("Error fetching currency rates:", error);
        setCurrencyRates({ USD: "خطأ", EUR: "خطأ", JOD: "خطأ" });
      }
    };

    fetchCurrencyRates();
    const currencyTimerId = setInterval(fetchCurrencyRates, 3600000); // Update every hour

    return () => {
      clearInterval(timerId);
      clearInterval(currencyTimerId);
    }
  }, []);

  return (
    <header className="bg-header-bg text-header-fg py-3 px-4 md:px-5 border-b-2 border-app-gold shadow-header-footer">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-3">
        <div className="flex items-center">
          <Image 
            src="https://i.imgur.com/79bO3U2.jpg" 
            alt="شعار الموقع" 
            width={80} 
            height={80} 
            className="rounded-full border-2 border-app-gold"
            data-ai-hint="logo construction"
            priority
          />
          <h1 className="logo-text text-gradient-logo text-2xl md:text-3xl font-bold mx-2 sm:mx-4">
            المحترف لحساب الكميات
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-2">
          <div className="time text-lg font-bold text-orange-500 bg-yellow-100/80 px-3 py-1 rounded-lg shadow-sm">
            {currentTime || 'تحميل الوقت...'}
          </div>
          <div className="currency-rates text-sm font-bold text-app-red bg-white/70 px-3 py-1.5 rounded-lg shadow-md hover:bg-white/90 transition-all hover:translate-y-[-2px]">
            <p className="mb-0.5 text-xs">أسعار العملات مقابل الشيكل:</p>
            <span className="whitespace-nowrap"> USD: <span className="text-blue-700">{currencyRates.USD}</span></span> | 
            <span className="whitespace-nowrap"> EUR: <span className="text-green-700">{currencyRates.EUR}</span></span> | 
            <span className="whitespace-nowrap"> JOD: <span className="text-purple-700">{currencyRates.JOD}</span></span> 
          </div>
          <div className="social-icons flex gap-3 items-center">
            <Link href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" 
                  className="p-2 rounded-full bg-white/20 hover:bg-app-gold/80 transition-all transform hover:scale-110 shadow-sm text-header-fg">
              <Facebook size={20} />
            </Link>
            <Link href="https://www.instagram.com/a.w.samarah3/" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/20 hover:bg-app-gold/80 transition-all transform hover:scale-110 shadow-sm text-header-fg">
              <Instagram size={20} />
            </Link>
            {/* Example for another icon if needed */}
            {/* <Link href="#" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/20 hover:bg-app-gold/80 transition-all transform hover:scale-110 shadow-sm text-header-fg">
              <Linkedin size={20} />
            </Link> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

    