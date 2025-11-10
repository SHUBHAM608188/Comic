// components/ViewWork.js
import { Link } from 'react-router-dom';

const ViewWork = () => {
  return (
    <div className="view-work">
      <Link to="/login" className="view-work-button">Welcome to Login </Link>
    </div>
  );
};

export default ViewWork;
