import { useEffect, useRef } from 'react';

const ParallaxBackground = () => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (layerRef.current) {
        const scrollY = window.scrollY;
        layerRef.current.style.transform = `rotate(-15deg) translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate repeated text
  const text = 'MIDNIGHT CLUB 夜中  ';
  const line = text.repeat(12);
  const lines = Array.from({ length: 60 }, (_, i) => (
    <div key={i} className="whitespace-nowrap select-none" style={{ lineHeight: '2.2em' }}>
      {line}
    </div>
  ));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Repeating text layer */}
      <div
        ref={layerRef}
        className="absolute font-orbitron font-bold text-[11px] tracking-[0.15em] uppercase"
        style={{
          color: '#121212',
          transform: 'rotate(-15deg)',
          top: '-40%',
          left: '-20%',
          width: '160%',
          height: '200%',
        }}
      >
        {lines}
      </div>

      {/* Radial gradient center light */}
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
