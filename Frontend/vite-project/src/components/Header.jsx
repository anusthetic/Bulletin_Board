import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../authSlice'; 
import light_mode from '../assets/light_mode.svg';
import dark_mode from '../assets/dark_mode.svg';

const THEME_KEY = 'bulletin-theme';

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isAuthenticated,user} = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply the theme to the document + persist it, whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  function handleLogout() {
    dispatch(logoutUser());
    navigate('/signup');
  }

  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true" />
        Bulletin
      </Link>

      <nav className="header-nav">

        {isAuthenticated && (
          <div className="flex-none gap-4">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost">
                {user?.name}
              </div>
              <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>{isAdmin && (
                  <>
                    <Link to="/notice/new" className="header-link">New notice</Link>
                    <Link to="/event/new" className="header-link">New event</Link>
                  </>
                  )}
                </li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </div>
        )}

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <img
            src={theme === 'light' ? dark_mode : light_mode}
            alt="Theme toggle"
          />
        </button>
      </nav>
    </header>
  );
}