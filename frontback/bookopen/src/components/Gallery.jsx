// components/Gallery.js
import React, { useState } from 'react';

const Gallery = () => {
  const images = [
    { src: "https://images.cara.app/production/posts/bf592aae-d03f-4b22-8d5d-45b95832a82a/metametaa-H-la14jkAquPEhRlIfrL_-34E2BE1B-E254-485E-A423-738C50552813.jpg?width=1920", alt: "Illustration 1" },
    { src: "https://images.cara.app/production/posts/e0248b0c-ed1a-4a07-9f1c-b1a06492ff75/lichjuliorra-qPRja9i5hmrdQ8dp66pFr--_-_-.jpg?width=1920", alt: "Illustration 2" },
    { src: "https://images.cara.app/production/posts/4618fa20-646c-448c-b6e2-8aa3e3a60d49/albabbgg-9ayTnbVaulo5nyaupq9iu-Untitled_Artwork-(69).jpg?width=1920", alt: "Illustration 3" },
    { src: "https://images.cara.app/production/posts/d1da59a6-3718-422e-91fd-6a82abf0e087/ayokonito-on8ojfTRsEESueWEu2MZq-20241001_161953721_iOS.jpg?width=1920", alt: "Illustration 4" },
    { src: "https://images.cara.app/production/posts/9838e61d-94c0-4c09-a2af-b54af9ac4517/ayokonito-byTnXbZlCdimJNpKIxEq2-CARA-new-brunswick-station.jpg?width=1920", alt: "Illustration 5" },
    { src: "https://images.cara.app/production/posts/ed263466-43d1-48d2-afaf-513e01b40e5f/madkobra-efR_aA_D5Lgygat0LP0Ah-kitsune-mask.jpg?width=1920", alt: "Illustration 6" },
    { src: "https://images.cara.app/production/posts/3a9ab09f-0d31-4691-a492-22f784efe915/maxulichney-hvnfgf9BDQ88KSyxRSQwt-IMG_4287.jpeg?width=1920", alt: "Illustration 7" },
    { src: "https://images.cara.app/production/posts/8f183544-f602-4bff-92b3-5cfb20f6b5ec/sholokhov09-IYo7IScm270lYEhYAqMq--D7D81EC3-C5B7-4AA0-98AE-48D98C0ADC8C.jpg?width=1920", alt: "Illustration 8" }
  ];

  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (src, alt) => setLightbox({ src, alt });
  const closeLightbox = () => setLightbox(null);

  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title">Illustrations and Sketches</h2>
      <p>
        You can learn new words and ideas by exploring pictures and stories.
        These drawings and sketches help everyone understand through images.
        <a href="" target="_blank" rel="noopener"></a>.
      </p>
      <div className="image-grid">
        {images.map((img, i) => (
          <img key={i} src={img.src} alt={img.alt} onClick={() => openLightbox(img.src, img.alt)} />
        ))}
      </div>
      {lightbox && (
        <div className="overlay" onClick={closeLightbox}>
          <img src={lightbox.src} alt={lightbox.alt} />
        </div>
      )}
    </section>
  );
};

export default Gallery;
