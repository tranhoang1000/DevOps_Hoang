import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/authform");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-name">
          MyFlix
        </Link>

        <div className="navbar-links">
          <Link to="/movies">Movies</Link>
          <Link to="/movies/action">Action</Link>
          <Link to="/movies/sci-fi">Sci-Fi</Link>
          <Link to="/movies/animation">Animation</Link>
          <Link to="/movies/romance">Romance</Link>
          {loggedInUser?.isAdmin && <Link to="/admin">Admin</Link>}
        </div>

        <div className="navbar-user">
          {loggedInUser ? (
            <>
              <span className="user-info">Chào, {loggedInUser.username}!</span>
              <button className="signup-link" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <button className="signup-link" onClick={handleSignUpClick}>
              Sign up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
