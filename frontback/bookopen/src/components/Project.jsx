// components/Project.js
import React, { useState } from 'react';

const Project = () => {
  const [activeTab, setActiveTab] = useState('Tab 1');
  const [lightbox, setLightbox] = useState(null);

  const tabs = [
    { key: 'Tab 1', label: 'Description', content: <p><em>Everyday Imaginings</em> was my first formal foray into comics. This minibook is a compilation of four shorts completed while taking Ryan Claytor’s Comics and the Visual Narrative course at Michigan State University.</p> },
    { key: 'Tab 2', label: 'Responsibilities', content: <p>Writing, pencils, digital inking, digital coloring, digital lettering.</p> },
    { key: 'Tab 3', label: 'Gallery', content: (
      <div>
        <img data-full="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571231bb49c752fb570b0a42_artist_statement_page_1_by_novemberkris-d4ay5tc.png" src="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/5712355949c752fb570b0e8a_artist_statement_tn.png" alt="Artist Statement" onClick={() => openLightbox("https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571231bb49c752fb570b0a42_artist_statement_page_1_by_novemberkris-d4ay5tc.png", "Artist Statement")} />
        <img data-full="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571235f4fa7d578851f9eacb_praise.png" src="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/5712356de096bbc10bd6e4f4_praise_tn.png" alt="Praise" onClick={() => openLightbox("https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571235f4fa7d578851f9eacb_praise.png", "Praise")} />
        <img data-full="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571235da49c752fb570b0efb_omairi.png" src="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/57123578e096bbc10bd6e4f5_omairi_tn.png" alt="Omairi" onClick={() => openLightbox("https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571235da49c752fb570b0efb_omairi.png", "Omairi")} />
        <img data-full="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571235c0e096bbc10bd6e4fd_welcome_distractions.jpg" src="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/5712358168d86d0058725a0f_welcome_distractions_tn.jpg" alt="Welcome Distractions" onClick={() => openLightbox("https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571235c0e096bbc10bd6e4fd_welcome_distractions.jpg", "Welcome Distractions")} />
      </div>
    ) }
  ];

  const openLightbox = (src, alt) => setLightbox({ src, alt });
  const closeLightbox = () => setLightbox(null);

  return (
    <div className="container" id="everyday">
      <div className="project-tile w-container">
        <img className="project-img right" src="https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/571231bb49c752fb570b0a42_artist_statement_page_1_by_novemberkris-d4ay5tc.png" width="300" alt="Everyday Imaginings cover" />
        <div style={{ flex: 1, minWidth: '240px' }}>
          <h3 className="project-heading">Everyday Imaginings</h3>
          <div className="project-tabs w-tabs">
            <div className="w-tab-menu" role="tablist" aria-label="Everyday Imaginings tabs">
              {tabs.map(tab => (
                <a key={tab.key} className={`project-tab-link w-inline-block w-tab-link ${activeTab === tab.key ? 'w--current' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab(tab.key); }} role="tab" aria-selected={activeTab === tab.key}>
                  <div>{tab.label}</div>
                </a>
              ))}
            </div>
            <div className="w-tab-content">
              {tabs.map(tab => (
                <div key={tab.key} className={`w-tab-pane ${activeTab === tab.key ? 'w--tab-active' : ''}`} data-w-tab={tab.key} role="tabpanel">
                  {tab.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="project-bottombar w-container"></div>
      {lightbox && (
        <div className="lightbox" id="lightbox" aria-modal="true" role="dialog" aria-label="Image viewer" onClick={closeLightbox}>
          <div className="lightbox-dialog">
            <img className="lightbox-img" src={lightbox.src} alt={lightbox.alt} />
            <figcaption className="lightbox-cap">{lightbox.alt}</figcaption>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
