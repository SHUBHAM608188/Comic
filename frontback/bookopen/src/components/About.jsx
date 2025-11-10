import React from 'react';

const About = () => {
  return (
    <>
      <h1 class="header">Stan Lee</h1>
      <img src="https://indianexpress.com/wp-content/uploads/2018/02/stan-lee-759.jpg" alt="Profile" className="profile-img" />

      <div className="about-text">
        <p><strong>Stan Lee</strong> was one of the most legendary and creative figures in comic book history.</p>
        <p>As the co-creator of many Marvel superheroes — including<strong>Spider-Man, Iron Man, The Hulk, Thor, Black Panther,</strong> and <strong>The X-Men</strong> — he helped shape an entire universe of storytelling.</p>
        <p>Stan Lee believed that every hero could be human, with strengths and flaws that readers could relate to.
His stories taught courage, responsibility, and hope, inspiring generations around the world.
Beyond his imagination, Stan Lee’s energy and love for fans made him a true symbol of creativity and connection.</p>
      </div>

        

      <footer className="pink-footer">
        “With great power comes great responsibility.” , ©Tribute to Stan Lee — The Man Who Made Heroes Human

      </footer>
    </>
  );
};

export default About;