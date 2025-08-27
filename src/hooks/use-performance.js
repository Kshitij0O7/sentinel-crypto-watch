import { useEffect, useRef } from 'react';

export const usePerformance = (componentName) => {
  const startTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    const endTime = performance.now();
    const loadTime = endTime - startTime.current;
    
    console.log(`🚀 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    
    // Track render performance
    renderCount.current += 1;
    if (renderCount.current > 1) {
      console.log(`🔄 ${componentName} re-rendered ${renderCount.current} times`);
    }
  }, []);

  useEffect(() => {
    return () => {
      const totalTime = performance.now() - startTime.current;
      console.log(`⏱️ ${componentName} total lifetime: ${totalTime.toFixed(2)}ms`);
    };
  }, [componentName]);

  return {
    startTime: startTime.current,
    renderCount: renderCount.current,
  };
};
