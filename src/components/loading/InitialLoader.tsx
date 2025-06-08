
"use client";

import { useState, useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';

interface InitialLoaderProps {
  children: ReactNode;
}

const InitialLoader = ({ children }: InitialLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [percentage, setPercentage] = useState(0);
  const [currentLoadingText, setCurrentLoadingText] = useState('جاري تهيئة النظام المتقدم');

  const percentageElementRef = useRef<HTMLDivElement>(null);
  const loadingTextElementRef = useRef<HTMLDivElement>(null);
  const interactiveGlowRef = useRef<HTMLDivElement>(null);
  const particles3dRef = useRef<HTMLDivElement>(null);
  const loadingContainerRef = useRef<HTMLDivElement>(null);

  const [logoDisplayUrl, setLogoDisplayUrl] = useState('https://i.imgur.com/79bO3U2.png');
  const [showTextFallback, setShowTextFallback] = useState(false);
  const logoErrorCount = useRef(0);
  
  const logoUrls = [
    'https://i.imgur.com/79bO3U2.png', // Primary
    'https://i.imgur.com/79bO3U2.jpg', // Fallback
  ];

  const handleLogoError = () => {
    logoErrorCount.current++;
    if (logoErrorCount.current < logoUrls.length) {
      setLogoDisplayUrl(logoUrls[logoErrorCount.current]);
    } else {
      setShowTextFallback(true);
    }
  };


  const loadingMessages = [
    'جاري تهيئة النظام المتقدم',
    'جاري تحميل الذكاء الاصطناعي',
    'جاري تجهيز قاعدة البيانات السحابية',
    'جاري تحضير واجهة المستخدم',
    'جاري التحقق من الأمان المتقدم',
    'جاري تفعيل التحليلات الذكية',
    'تم التحميل بنجاح! مرحباً بك'
  ];

  // Effect for 3D particles
  useEffect(() => {
    if (!isLoading || !particles3dRef.current) return;
    const particlesContainer = particles3dRef.current;
    if (particlesContainer.children.length > 0) return; // Avoid re-adding particles

    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-3d-loader';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
      const hue = Math.random() * 60 + 200;
      particle.style.background = `radial-gradient(circle, hsla(${hue}, 70%, 60%, 0.8) 0%, transparent 70%)`;
      particle.style.boxShadow = `0 0 20px hsla(${hue}, 70%, 60%, 0.5)`;
      particlesContainer.appendChild(particle);
    }
  }, [isLoading]);

  // Effect for progress animation
  useEffect(() => {
    if (!isLoading) return;
    let currentPercentage = 0;
    let localCurrentMessageIndex = 0;

    const updateLoadingTextInternal = (messageIndex: number) => {
        setCurrentLoadingText(loadingMessages[messageIndex]);
    };
    
    updateLoadingTextInternal(localCurrentMessageIndex);

    const progressInterval = setInterval(() => {
      if (currentPercentage < 100) {
        let increment = Math.random() * 2 + 0.5;
        if (currentPercentage > 90) increment = Math.random() * 0.5 + 0.1;
        else if (currentPercentage > 70) increment = Math.random() * 1 + 0.3;
        
        currentPercentage += increment;
        if (currentPercentage > 100) currentPercentage = 100;

        setPercentage(Math.floor(currentPercentage));

        if (percentageElementRef.current) {
          percentageElementRef.current.style.transform = 'scale(1.05)';
          setTimeout(() => {
            if (percentageElementRef.current) percentageElementRef.current.style.transform = 'scale(1)';
          }, 100);
        }

        const messageIndex = Math.floor((currentPercentage / 100) * (loadingMessages.length - 1));
        if (messageIndex !== localCurrentMessageIndex && messageIndex < loadingMessages.length) {
          localCurrentMessageIndex = messageIndex;
          updateLoadingTextInternal(localCurrentMessageIndex);
        }

        if (currentPercentage >= 100) {
          clearInterval(progressInterval);
          if (percentageElementRef.current) {
            percentageElementRef.current.style.animation = 'none'; // Stop percentageGlow
            percentageElementRef.current.style.background = 'var(--loader-secondary-gradient)';
            percentageElementRef.current.style.webkitBackgroundClip = 'text';
            percentageElementRef.current.style.webkitTextFillColor = 'transparent';
          }
          // Update to final message
          updateLoadingTextInternal(loadingMessages.length - 1);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500); // Delay before hiding loader
        }
      }
    }, 80);

    return () => clearInterval(progressInterval);
  }, [isLoading]); 

  // Effect for interactive glow and container tilt
  useEffect(() => {
    if (!isLoading) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (interactiveGlowRef.current) {
        interactiveGlowRef.current.style.left = e.clientX + 'px';
        interactiveGlowRef.current.style.top = e.clientY + 'px';
      }
      if (loadingContainerRef.current) {
        const container = loadingContainerRef.current;
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (e.clientY - centerY) / 20;
        const rotateY = (e.clientX - centerX) / 20;
        container.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      }
    };

    const handleMouseLeaveContainer = () => {
      if (loadingContainerRef.current) {
        // Reset to the floating animation style
        loadingContainerRef.current.style.transform = ''; // Let CSS animation take over
      }
    };
    
    const createClickRipple = (x:number, y:number) => {
      const ripple = document.createElement('div');
      ripple.className = 'ripple-loader';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    };

    const handleClick = (e: MouseEvent) => {
        createClickRipple(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    if(loadingContainerRef.current) {
      loadingContainerRef.current.addEventListener('mouseleave', handleMouseLeaveContainer);
    }
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if(loadingContainerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        loadingContainerRef.current.removeEventListener('mouseleave', handleMouseLeaveContainer);
      }
      document.removeEventListener('click', handleClick);
    };
  }, [isLoading]);


  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="initial-loader-body">
      <div className="background-3d-loader"></div>
      <div className="geometric-grid-loader"></div>
      <div className="particles-3d-loader" ref={particles3dRef}></div>
      <div className="light-rays-loader"></div>
      <div className="interactive-glow-loader" ref={interactiveGlowRef}></div>
      
      <div className="loading-container-loader" ref={loadingContainerRef}>
          <div className="logo-container-loader">
              <div className="logo-loader">
                {!showTextFallback ? (
                  <Image
                    src={logoDisplayUrl}
                    alt="شعار المحترف"
                    width={90}
                    height={90}
                    className="logo-image-loader"
                    priority
                    unoptimized
                    onError={handleLogoError}
                    data-ai-hint="logo construction"
                  />
                ) : (
                  <div className="logo-fallback-loader" style={{ display: 'block' }}>🏗️</div>
                )}
              </div>
          </div>
          
          <h1 className="title-loader">المحترف</h1>
          <p className="subtitle-loader">منصة متطورة لحساب الكميات ومتابعة مشاريع الإنشاءات بتقنيات الذكاء الاصطناعي</p>
          
          <div className="progress-section-loader">
              <div className="percentage-display-loader" ref={percentageElementRef}>{percentage}%</div>
              <div className="circular-progress-loader"></div>
              <div className="multi-progress-loader">
                  {[...Array(5)].map((_, i) => (
                      <div className="progress-bar-loader" key={i}><div className="progress-fill-loader"></div></div>
                  ))}
              </div>
          </div>
          
          <div className="loading-text-loader" ref={loadingTextElementRef} dangerouslySetInnerHTML={{ __html: `${currentLoadingText}<span class="typing-dots-loader"></span>` }}>
          </div>
          
          <div className="features-grid-loader">
              <div className="feature-card-loader">
                  <div className="feature-icon-loader">🧮</div>
                  <div className="feature-title-loader">حساب ذكي</div>
              </div>
              <div className="feature-card-loader">
                  <div className="feature-icon-loader">🏗️</div>
                  <div className="feature-title-loader">متابعة مشاريع</div>
              </div>
              <div className="feature-card-loader">
                  <div className="feature-icon-loader">📊</div>
                  <div className="feature-title-loader">تحليلات متقدمة</div>
              </div>
              <div className="feature-card-loader">
                  <div className="feature-icon-loader">🤖</div>
                  <div className="feature-title-loader">ذكاء اصطناعي</div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default InitialLoader;
