import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        KADA Forum
      </Link>
      <div className="nav-links">
        <Link to="/posts">Posts</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
