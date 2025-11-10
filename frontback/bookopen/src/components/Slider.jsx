// components/Slider.js
import React, { useState, useEffect } from 'react';

const Slider = () => {
  const slides = [
    { src: "https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/55d87c9ea811abde4e36ab8c_bringyoutheseasons_web.png", alt: "Bring You The Seasons" },
    { src: "https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/55d915c2d90693dd61053f07_is_cover_2014_web.png", alt: "IS Cover 2014" },
    { src: "https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/55d91ae6d90693dd61053f90_jamesamitycolor.png", alt: "James Amity Color" }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const showSlide = (n) => setIndex((n + slides.length) % slides.length);

  return (
    <section className="slider" aria-roledescription="carousel" aria-label="Featured works">
      <div className="slides" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((slide, i) => (
          <div key={i} className="slide">
            <img src={slide.src} alt={slide.alt} />
          </div>
        ))}
      </div>
      <button className="arrow left" onClick={() => showSlide(index - 1)} aria-label="Previous">&#10094;</button>
      <button className="arrow right" onClick={() => showSlide(index + 1)} aria-label="Next">&#10095;</button>
      <div className="dots" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <span key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => showSlide(i)} aria-label={`Slide ${i + 1}`}></span>
        ))}
      </div>
    </section>
  );
};

export default Slider;
