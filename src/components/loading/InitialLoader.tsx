'use client';

import { useEffect, useRef, useState, type ReactNode, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface InitialLoaderProps {
  children: ReactNode;
  minDuration?: number;
}

const loadingSteps = [
  { text: "تهيئة النظام الأساسي", detail: "Loading core system architecture...", icon: "⚙️" },
  { text: "تحميل المكتبات الهندسية", detail: "Initializing engineering libraries...", icon: "📐" },
  { text: "إعداد قواعد البيانات", detail: "Connecting to calculation databases...", icon: "🗄️" },
  { text: "معايرة أدوات الحساب", detail: "Calibrating calculation engines...", icon: "🔬" },
  { text: "تجهيز واجهة المستخدم", detail: "Preparing user interface...", icon: "🎨" },
  { text: "التحقق من الأمان", detail: "Running security protocols...", icon: "🔐" },
  { text: "تحسين الأداء", detail: "Optimizing performance metrics...", icon: "⚡" },
  { text: "اللمسات الأخيرة", detail: "Finalizing system components...", icon: "✨" },
  { text: "مرحباً بك في النظام", detail: "Welcome to professional calculations!", icon: "🚀" },
];

const InitialLoader = ({ children, minDuration = 3000 }: InitialLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  const startTimeRef = useRef(0);
  const animationIdRef = useRef<number>();
  const progressCompleteRef = useRef(false);

  // دالة محسنة لتحديث التقدم
  const updateProgress = useCallback(() => {
    if (progressCompleteRef.current) return;

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const minProgress = Math.min((elapsed / minDuration) * 100, 100);
    
    setProgress(prev => {
      if (prev >= 100) {
        progressCompleteRef.current = true;
        return 100;
      }

      const increment = prev < 20 ? 0.5 : 
                       prev < 80 ? 1.2 : 0.8;
      const newProgress = Math.min(prev + increment + Math.random() * 0.3, minProgress);
      
      return newProgress;
    });

    if (!progressCompleteRef.current) {
      animationIdRef.current = requestAnimationFrame(updateProgress);
    }
  }, [minDuration]);

  // تهيئة المكون
  useEffect(() => {
    startTimeRef.current = Date.now();
    animationIdRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [updateProgress]);

  // تحديث الخطوة الحالية
  useEffect(() => {
    const stepProgress = (progress / 100) * loadingSteps.length;
    setCurrentStep(Math.min(Math.floor(stepProgress), loadingSteps.length - 1));
  }, [progress]);

  // التعامل مع اكتمال التحميل
  useEffect(() => {
    if (progress >= 100 && !fadeOut) {
      setFadeOut(true);
      const timer = setTimeout(() => setShowLoader(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, fadeOut]);

  if (!showLoader) {
    return <>{children}</>;
  }

  const stepProgressFraction = (progress / 100) * loadingSteps.length;
  const stepInnerProgress = (stepProgressFraction % 1) * 100;
  const elapsedTime = startTimeRef.current ? ((Date.now() - startTimeRef.current) / 1000).toFixed(1) : '0.0';

  return (
    <div className={cn(
      "fixed inset-0 z-50 overflow-hidden transition-all duration-1000 ease-out",
      "bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900",
      fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
    )}>
      {/* باقي JSX */}
    </div>
  );
};

export default InitialLoader;
