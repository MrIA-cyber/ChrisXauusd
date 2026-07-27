import { useRef, useState, useCallback } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  ms?: number;
}

export function useLongPress({ onLongPress, ms = 5000 }: UseLongPressOptions) {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsPressing(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const updateProgress = () => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsed / ms) * 100, 100);
      setProgress(currentProgress);

      if (elapsed < ms) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    timerRef.current = setTimeout(() => {
      // Trigger haptic vibration on mobile
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate([100, 50, 100]);
        } catch (e) {
          // Ignore vibration errors on desktop
        }
      }

      onLongPress();
      setIsPressing(false);
      setProgress(0);
      startTimeRef.current = null;
    }, ms);
  }, [onLongPress, ms]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPressing(false);
    setProgress(0);
    startTimeRef.current = null;
  }, []);

  return {
    isPressing,
    progress,
    handlers: {
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchEnd: stop,
      onTouchCancel: stop,
    },
  };
}
