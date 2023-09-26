import { data } from 'autoprefixer';
import { useEffect, useRef, useState } from 'react';

let isFetching = false;

const useIntersection = ({ ref, func, initialValue }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(initialValue);

  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(entries[0].isIntersecting);
        console.log('INTERSCET REACHED');
      },
      {
        root: null,
        threshold: 0.5,
        rootMargin: '15%',
      }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    console.log('IS_INTERSECTING', isIntersecting, isFetching);
    (() => {
      if (isFetching) return;
      console.log('EFFECT REACHED');
      isFetching = true;
      setLoading(true);
      setTimeout(async () => {
        const data = await func();
        console.log('DATA:', data);
        setResult((prev) => [...prev, ...data]);
        setLoading(false);
        isFetching = false;
      }, 3000);
    })();
  }, [isIntersecting]);

  return {
    loading,
    result,
  };
};

export default useIntersection;
