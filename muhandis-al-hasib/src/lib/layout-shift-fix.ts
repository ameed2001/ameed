'use client';

// This file contains the layout shift prevention logic provided by the user.
// It is intended to run on the client side to manage the body and scrollbar behavior.

declare global {
  interface Window {
    openModal: () => void;
    closeModal: () => void;
  }
}

class LayoutShiftPrevention {
  scrollbarWidth: number;
  isModalOpen: boolean;
  scrollPosition: number;
  body: HTMLElement;
  html: HTMLElement;

  constructor() {
    // This code runs only in the browser.
    if (typeof document === 'undefined') {
      this.scrollbarWidth = 0;
      this.isModalOpen = false;
      this.scrollPosition = 0;
      this.body = {} as HTMLElement;
      this.html = {} as HTMLElement;
      return;
    }

    this.body = document.body;
    this.html = document.documentElement;
    this.scrollbarWidth = this.getScrollbarWidth();
    this.isModalOpen = false;
    this.scrollPosition = 0;
    this.init();
  }

  getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    (outer.style as any).msOverflowStyle = 'scrollbar';
    this.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    if (outer.parentNode) {
      outer.parentNode.removeChild(outer);
    }
    return scrollbarWidth;
  }

  init() {
    this.html.style.setProperty('--scrollbar-width', `${this.scrollbarWidth}px`);
  }

  openModal() {
    if (this.isModalOpen) return;
    const scrollY = window.scrollY;
    this.body.style.position = 'fixed';
    this.body.style.top = `-${scrollY}px`;
    this.body.style.width = '100%';
    this.body.style.paddingRight = `${this.scrollbarWidth}px`;
    this.body.classList.add('modal-open');
    this.scrollPosition = scrollY;
    this.isModalOpen = true;
  }

  closeModal() {
    if (!this.isModalOpen) return;
    this.body.style.position = '';
    this.body.style.top = '';
    this.body.style.width = '';
    this.body.style.paddingRight = '';
    this.body.classList.remove('modal-open');
    window.scrollTo(0, this.scrollPosition);
    this.isModalOpen = false;
  }

  handleDropdownOpen(dropdownElement: HTMLElement) {
    if (!dropdownElement) return;
    const rect = dropdownElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    if (rect.right > viewportWidth) {
      dropdownElement.style.right = '0';
      dropdownElement.style.left = 'auto';
    }
  }

  positionTooltip(tooltipElement: HTMLElement, targetElement: HTMLElement) {
    if (!tooltipElement || !targetElement) return;
    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    let top = targetRect.top - tooltipRect.height - 10;
    let left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
    if (top < 0) top = targetRect.bottom + 10;
    if (left < 0) left = 10;
    else if (left + tooltipRect.width > window.innerWidth)
      left = window.innerWidth - tooltipRect.width - 10;
    tooltipElement.style.position = 'fixed';
    tooltipElement.style.top = `${top}px`;
    tooltipElement.style.left = `${left}px`;
    tooltipElement.style.zIndex = '9999';
  }
}

if (typeof window !== 'undefined') {
  const layoutShiftPrevention = new LayoutShiftPrevention();
  window.openModal = () => layoutShiftPrevention.openModal();
  window.closeModal = () => layoutShiftPrevention.closeModal();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const modals = document.querySelectorAll('[role="dialog"], .modal, .popup');
        const dropdowns = document.querySelectorAll<HTMLElement>('.dropdown-menu:not(.hidden)');
        if (modals.length > 0 && !layoutShiftPrevention.isModalOpen) layoutShiftPrevention.openModal();
        else if (modals.length === 0 && layoutShiftPrevention.isModalOpen) layoutShiftPrevention.closeModal();
        dropdowns.forEach(dropdown => layoutShiftPrevention.handleDropdownOpen(dropdown));
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('[data-modal-trigger], [data-toggle="modal"]').forEach(trigger => {
      if ((trigger as HTMLElement).contains(event.target as Node)) {
        setTimeout(() => layoutShiftPrevention.openModal(), 10);
      }
    });
    document.querySelectorAll('[data-modal-close], .modal-close, [data-dismiss="modal"]').forEach(closer => {
      if ((closer as HTMLElement).contains(event.target as Node)) layoutShiftPrevention.closeModal();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && layoutShiftPrevention.isModalOpen) layoutShiftPrevention.closeModal();
  });

  let resizeTimeout: NodeJS.Timeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newWidth = layoutShiftPrevention.getScrollbarWidth();
      if (newWidth !== layoutShiftPrevention.scrollbarWidth) {
        layoutShiftPrevention.scrollbarWidth = newWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${newWidth}px`);
      }
    }, 200);
  });
}