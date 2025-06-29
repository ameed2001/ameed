
'use client';

import { useLayoutEffect } from 'react';

/**
 * A custom React hook to prevent layout shift when a modal or dropdown is opened.
 * It calculates the scrollbar width and applies padding to the body and fixed elements
 * to compensate, while also preventing the body from scrolling.
 * @param isOpen - A boolean indicating whether the modal/dropdown is open.
 */
const usePreventLayoutShift = (isOpen: boolean) => {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // We target fixed/sticky elements that might shift.
    const fixedElements = document.querySelectorAll('header, aside.bg-card');

    if (isOpen) {
      document.body.classList.add('no-scroll');
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      fixedElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.paddingRight = `${scrollbarWidth}px`;
        }
      });
    }

    // Cleanup function to restore original styles
    return () => {
      document.body.classList.remove('no-scroll');
      document.body.style.paddingRight = originalBodyPaddingRight;
      
      fixedElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.paddingRight = '';
        }
      });
    };
  }, [isOpen]);
};

export default usePreventLayoutShift;
