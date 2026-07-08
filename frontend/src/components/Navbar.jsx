import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        KADA Forum
      </Link>
      <div className="nav-links">
        <Link to="/posts">Posts</Link>

        {user ? (
          <>
            <span className="user-name">Hello, {user.name}</span>
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
