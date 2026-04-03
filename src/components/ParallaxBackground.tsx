import { useEffect, useRef } from 'react';

const ParallaxBackground = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const scrollOffset = useRef(0);
  const animOffset = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollOffset.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      animOffset.current += dt * 5;
      if (layerRef.current) {
        layerRef.current.style.transform = `rotate(15deg) translate(${animOffset.current % 500}px, ${scrollOffset.current * 0.3}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const text = 'MIDNIGHT CLUB 夜中       ';
  const line = text.repeat(8);
  const lines = Array.from({ length: 30 }, (_, i) => (
    <div key={i} className="whitespace-nowrap select-none" style={{ lineHeight: '5em', letterSpacing: '0.6em' }}>
      {line}
    </div>
  ));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        ref={layerRef}
        className="absolute font-orbitron font-bold text-[10px] uppercase"
        style={{
          color: '#111111',
          textShadow: '0 0 10px hsl(330 100% 49% / 0.04)',
          transform: 'rotate(15deg)',
          top: '-50%',
          left: '-40%',
          width: '220%',
          height: '250%',
        }}
      >
        {lines}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(330 100% 49% / 0.04) 0%, transparent 60%)',
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
