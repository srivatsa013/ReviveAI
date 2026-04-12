import { useState, useRef } from 'react';
import '../App.css';

function Showcase() {
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);
  const containerRef = useRef(null);

  const updatePos = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  };

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp   = () => { dragging.current = false; };

  const onTouchMove = (e) => updatePos(e.touches[0].clientX);

  return (
    <section className="showcase" id="showcase">
      <h2>Unrivaled Precision</h2>
      <p>Drag to reveal the details our AI recovers.</p>

      <div
        ref={containerRef}
        className="slider-container"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
      >
        {/* Sharp — full background */}
        <div className="slider-sharp">
          <img src="/images/landscape-image.jpg" alt="Restored" />
        </div>

        {/* Blurry — clipped by width */}
        <div className="slider-blurry" style={{ width: `${sliderPos}%` }}>
          <img src="/images/landscape-image.jpg" alt="Original" />
        </div>

        {/* Handle */}
        <div
          className="slider-handle"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={onMouseDown}
        >
          ⇔
        </div>

        <span className="slider-label blurry">BLURRY</span>
        <span className="slider-label restored">RESTORED</span>
      </div>
    </section>
  );
}

export default Showcase;