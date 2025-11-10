import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedComics = () => {
  const [activeTab, setActiveTab] = useState('tab-desc');
  const [title, setTitle] = useState('Infinite Spiral');
  const [description, setDescription] = useState('Multiple worlds meets time travel in <em>Infinite Spiral</em>, my ongoing Y.A. fantasy webcomic...');
  const [responsibilities, setResponsibilities] = useState('Writing, pencils, digital inking, digital coloring, digital lettering.');
  const [galleryImages, setGalleryImages] = useState([]);
  const [coverSrc, setCoverSrc] = useState('https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/56fdca4abca55e25190988f7_is_04_95_web.png');
  const [price, setPrice] = useState('0.0'); // ✅ new price state

  useEffect(() => {
    // Fetch initial data from backend
    axios.get('http://localhost:5000/api/comic')
      .then(res => {
        if (res.data.title) setTitle(res.data.title);
        if (res.data.description) setDescription(res.data.description);
        if (res.data.responsibilities) setResponsibilities(res.data.responsibilities);
        if (res.data.galleryImages) setGalleryImages(res.data.galleryImages);
        if (res.data.coverSrc) setCoverSrc(res.data.coverSrc);
        if (res.data.price) setPrice(res.data.price); // ✅ load price if available
      })
      .catch(err => console.error(err));
  }, []);
price
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newImages = e.target['input-image-urls'].value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const updatedImages = [...newImages, ...galleryImages];
    setGalleryImages(updatedImages);

    // Save to backend
    axios.post('http://localhost:5000/api/comic', {
      title,
      description,
      responsibilities,
      galleryImages: updatedImages,
      coverSrc,
      price, // ✅ include price in payload
    })
      .then(() => alert('Comic updated successfully!'))
      .catch(err => console.error(err));

    e.target['input-image-urls'].value = '';
    e.target['input-cover-file'].value = '';
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="chauhan-header">
    <hooder><h1>Featured Comics</h1>
    <a href="/dashboard" className="home-link">
         <h1> ⏪ </h1>
        </a>
    </hooder>
    </div>
      <div className="container">
        <div className="comic-cover">
          <img
            id="cover-image"
            className="project-img"
            src={coverSrc}
            width="300"
            alt="Infinite Spiral Cover"
          />
        </div>

        <div className="details">
          <h3 id="comic-title" className="comic-title">{title}</h3>

          <nav className="tabs-menu" role="tablist">
            <button className={`tab-link ${activeTab === 'tab-desc' ? 'active' : ''}`} onClick={() => handleTabClick('tab-desc')} aria-controls="tab-desc">Description</button>
            <button className={`tab-link ${activeTab === 'tab-resp' ? 'active' : ''}`} onClick={() => handleTabClick('tab-resp')} aria-controls="tab-resp">Responsibilities</button>
            <button className={`tab-link ${activeTab === 'tab-gallery' ? 'active' : ''}`} onClick={() => handleTabClick('tab-gallery')} aria-controls="tab-gallery">Gallery</button>
          </nav>

          <section className="tab-content">
            <article id="tab-desc" className={`tab-pane ${activeTab === 'tab-desc' ? 'active' : ''}`}>
              <p id="desc-text" dangerouslySetInnerHTML={{ __html: description }}></p>
            </article>
            <article id="tab-resp" className={`tab-pane ${activeTab === 'tab-resp' ? 'active' : ''}`}>
              <p id="resp-text">{responsibilities}</p>
            </article>
            <article id="tab-gallery" className={`tab-pane ${activeTab === 'tab-gallery' ? 'active' : ''}`}>
              <div id="gallery-grid" className="gallery-grid">
                {galleryImages.map((src, index) => (
                  <a key={index} href={src} target="_blank" rel="noopener noreferrer">
                    <img src={src} alt="Uploaded image" />
                  </a>
                ))}
              </div>
            </article>
          </section>

          {/* ===== Form Section ===== */}
          <form id="editor-form" className="editor-form" onSubmit={handleSubmit} aria-label="Comic editor">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="input-title">Title</label>
                <input id="input-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="form-field">
                <label htmlFor="input-price">Price (RS)</label>
                <input
                  id="input-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-field">
                <label htmlFor="input-cover-file">Upload cover image (local file)</label>
                <input id="input-cover-file" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field" style={{ flex: '2 1 100%' }}>
                <label htmlFor="input-desc">Description</label>
                <textarea id="input-desc" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field" style={{ flex: '1 1 100%' }}>
                <label htmlFor="input-resp">Responsibilities</label>
                <input id="input-resp" type="text" value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field" style={{ flex: '2 1 100%' }}>
                <label htmlFor="input-image-urls">Gallery (image URLs — one per line)</label>
                <textarea id="input-image-urls"></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" id="btn-reset" className="btn small ghost" onClick={handleReset}>Reset</button>
              <button type="submit" id="btn-submit" className="btn small primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FeaturedComics;
