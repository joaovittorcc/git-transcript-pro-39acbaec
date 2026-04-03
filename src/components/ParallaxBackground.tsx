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
      animOffset.current += dt * 12; // 12px per second lateral drift
      if (layerRef.current) {
        layerRef.current.style.transform = `rotate(-15deg) translate(${-animOffset.current % 400}px, ${scrollOffset.current * 0.3}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const text = 'MIDNIGHT CLUB 夜中    ';
  const line = text.repeat(14);
  const lines = Array.from({ length: 50 }, (_, i) => (
    <div key={i} className="whitespace-nowrap select-none" style={{ lineHeight: '3.6em', letterSpacing: '0.5em' }}>
      {line}
    </div>
  ));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        ref={layerRef}
        className="absolute font-orbitron font-bold text-[11px] uppercase"
        style={{
          color: '#151515',
          textShadow: '0 0 8px hsl(330 100% 49% / 0.06)',
          transform: 'rotate(-15deg)',
          top: '-50%',
          left: '-30%',
          width: '200%',
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
