// components/Navbar.js
import { Link } from 'react-router-dom';
import { RiAdminFill } from 'react-icons/ri';

const Navbar = () => {
  return (
    <nav>
      <div className="nav-center">
        <Link to="/" className="active">Home</Link>
        <a href="/history">History</a>
        <Link to="/gallery">Visit</Link>
        <a href="/read">Read</a>
        <a href="/featuredComics">Buy</a>
      <a href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&su=Let%27s+talk+art+and+design!&to=shubham.chauhan8493@gmail.com">Contact</a>
      
      
      </div>
<a href="/card" title="Card" className="cart-link">
  🛒
</a>

      <a href="/admin" title="Administrator Access" className="admin-link">
        <RiAdminFill size="2em" aria-hidden="true" />
      </a>
    </nav>
  );
};

export default Navbar;