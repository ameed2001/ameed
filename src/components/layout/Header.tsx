"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

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
        // API key from user's prototype
        const apiKey = "e256bd321903a099d3e8e81e"; 
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/ILS`);
        const data = await response.json();
        if (data.conversion_rates) {
          setCurrencyRates({
            USD: (1 / data.conversion_rates.USD).toFixed(3),
            EUR: (1 / data.conversion_rates.EUR).toFixed(3),
            JOD: (1 / data.conversion_rates.JOD).toFixed(3),
          });
        } else {
          setCurrencyRates({ USD: "خطأ", EUR: "خطأ", JOD: "خطأ" });
        }
      } catch (error) {
        console.error("Error fetching currency rates:", error);
        setCurrencyRates({ USD: "خطأ", EUR: "خطأ", JOD: "خطأ" });
      }
    };

    fetchCurrencyRates();

    return () => clearInterval(timerId);
  }, []);

  return (
    <header className="bg-header-bg text-header-fg py-3 px-5 border-b-2 border-app-gold shadow-header-footer">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <Image 
            src="https://i.imgur.com/79bO3U2.jpg" 
            alt="شعار الموقع" 
            width={80} 
            height={80} 
            className="rounded-full border-2 border-app-gold"
            data-ai-hint="logo construction"
          />
          <h1 className="logo-text text-gradient-logo text-2xl md:text-3xl font-bold mx-4">
            المحترف لحساب الكميات
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 mt-3 md:mt-0">
          <div className="time text-lg font-bold text-orange-500 bg-yellow-100/80 px-4 py-1 rounded-lg shadow-sm">
            {currentTime}
          </div>
          <div className="currency-rates text-sm font-bold text-app-red bg-white/70 px-3 py-2 rounded-lg shadow-md hover:bg-white/90 transition-all">
            <p className="mb-1">أسعار العملات مقابل الشيكل</p>
            <span> USD: <span className="text-blue-700">{currencyRates.USD}</span></span> | 
            <span> EUR: <span className="text-green-700">{currencyRates.EUR}</span></span> | 
            <span> JOD: <span className="text-purple-700">{currencyRates.JOD}</span></span> 
          </div>
          <div className="social-icons flex gap-3">
            <Link href="https://www.facebook.com/a.w.samarah4" target="_blank" rel="noopener noreferrer" 
                  className="p-2 rounded-full bg-white/20 hover:bg-app-gold/80 transition-all transform hover:scale-110 shadow-sm">
              <Facebook size={24} className="text-header-fg" />
            </Link>
            <Link href="https://www.instagram.com/a.w.samarah3/" target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/20 hover:bg-app-gold/80 transition-all transform hover:scale-110 shadow-sm">
              <Instagram size={24} className="text-header-fg" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
