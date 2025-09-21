import { useEffect, useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface UseMobileGesturesOptions extends SwipeHandlers {
  threshold?: number; // Minimum distance for a swipe
  velocityThreshold?: number; // Minimum velocity for a swipe
  timeThreshold?: number; // Maximum time for a swipe
  preventScroll?: boolean;
}

export function useMobileGestures(options: UseMobileGesturesOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
    timeThreshold = 300,
    preventScroll = false
  } = options;

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    if (preventScroll) {
      e.preventDefault();
    }
  }, [preventScroll]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const velocity = Math.max(absDeltaX, absDeltaY) / deltaTime;

    // Check if the swipe meets our criteria
    if (deltaTime <= timeThreshold && velocity >= velocityThreshold) {
      // Determine if swipe is horizontal or vertical
      if (absDeltaX > absDeltaY && absDeltaX > threshold) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    touchStart.current = null;

    if (preventScroll) {
      e.preventDefault();
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocityThreshold, timeThreshold, preventScroll]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventScroll) {
      e.preventDefault();
    }
  }, [preventScroll]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add passive: false only if we need to prevent default
    const options = { passive: !preventScroll };

    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchend', handleTouchEnd, options);
    if (preventScroll) {
      element.addEventListener('touchmove', handleTouchMove, options);
    }

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      if (preventScroll) {
        element.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove, preventScroll]);

  return elementRef;
}

// Hook for mobile-specific interactions
export function useMobileInteractions() {
  // Detect if user is on mobile
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
  // Detect if device supports touch
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Detect screen orientation
  const isPortrait = window.innerHeight > window.innerWidth;
  const isLandscape = !isPortrait;

  // Get viewport dimensions
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Check if it's a small mobile screen
  const isSmallMobile = isMobile && viewportWidth < 400;

  return {
    isMobile,
    hasTouch,
    isPortrait,
    isLandscape,
    viewportHeight,
    viewportWidth,
    isSmallMobile
  };
}

// Enhanced drag handler for mobile
export function useMobileDragAndDrop() {
  const draggedElement = useRef<HTMLElement | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleDragStart = useCallback((e: TouchEvent, element: HTMLElement) => {
    const touch = e.touches[0];
    const rect = element.getBoundingClientRect();
    
    draggedElement.current = element;
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    isDragging.current = true;

    // Add visual feedback
    element.style.opacity = '0.8';
    element.style.transform = 'scale(1.05)';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';

    e.preventDefault();
  }, []);

  const handleDragMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || !draggedElement.current) return;

    const touch = e.touches[0];
    const x = touch.clientX - dragOffset.current.x;
    const y = touch.clientY - dragOffset.current.y;

    draggedElement.current.style.position = 'fixed';
    draggedElement.current.style.left = `${x}px`;
    draggedElement.current.style.top = `${y}px`;

    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback((e: TouchEvent, onDrop?: (element: HTMLElement, dropTarget: Element | null) => void) => {
    if (!isDragging.current || !draggedElement.current) return;

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    // Reset visual feedback
    draggedElement.current.style.opacity = '';
    draggedElement.current.style.transform = '';
    draggedElement.current.style.zIndex = '';
    draggedElement.current.style.position = '';
    draggedElement.current.style.left = '';
    draggedElement.current.style.top = '';
    draggedElement.current.style.pointerEvents = '';

    if (onDrop) {
      onDrop(draggedElement.current, dropTarget);
    }

    draggedElement.current = null;
    isDragging.current = false;

    e.preventDefault();
  }, []);

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    isDragging: () => isDragging.current
  };
}

// Hook for mobile-optimized file handling
export function useMobileFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = useCallback((accept?: string, multiple = false) => {
    if (!fileInputRef.current) {
      // Create a temporary file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept || '*/*';
      input.multiple = multiple;
      
      return new Promise<FileList | null>((resolve) => {
        input.addEventListener('change', () => {
          resolve(input.files);
        });
        
        input.addEventListener('cancel', () => {
          resolve(null);
        });
        
        input.click();
      });
    }

    fileInputRef.current.accept = accept || '*/*';
    fileInputRef.current.multiple = multiple;
    
    return new Promise<FileList | null>((resolve) => {
      const handleChange = () => {
        resolve(fileInputRef.current?.files || null);
        fileInputRef.current?.removeEventListener('change', handleChange);
      };
      
      fileInputRef.current?.addEventListener('change', handleChange);
      fileInputRef.current?.click();
    });
  }, []);

  return {
    fileInputRef,
    triggerFileSelect
  };
}

// Component for mobile-optimized modal backdrop
interface MobileModalBackdropProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function MobileModalBackdrop({ isVisible, onClose, children, className }: MobileModalBackdropProps) {
  const backdropRef = useMobileGestures({
    onSwipeDown: onClose, // Swipe down to close modal
    threshold: 100
  });

  useEffect(() => {
    if (isVisible) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 ${className || ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-t-lg sm:rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
