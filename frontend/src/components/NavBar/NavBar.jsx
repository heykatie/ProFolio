import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useModal from '../../context/useModal';
import SignupModal from '../Modals/SignupModal';
import LoginModal from '../Modals/LoginModal';
import ProfileButton from '../ProfileButton';
import { fetchTheme, setTheme, updateTheme } from '../../store/theme';
import profolioIcon from '../../../../images/profolio-icon.png';

const Navbar = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const theme = useSelector((state) => state.theme?.theme);
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  // Open modals
  const openSignupModal = () => setModalContent(<SignupModal />);
  const openLoginModal = () => setModalContent(<LoginModal />);

  // Apply theme to the DOM
  useEffect(() => {
    const activeTheme = sessionUser?.themePreference || theme;
    if (!activeTheme) return;

    document.documentElement.setAttribute('data-theme', activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [sessionUser, theme]);

  // Sync theme on app load
  useEffect(() => {
    if (!sessionUser) {
      const savedTheme = localStorage.getItem('theme') || 'light';
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch, sessionUser]);

  // Fetch theme when user logs in
  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchTheme(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  // Toggle theme handler
  const toggleTheme = async () => {
    const currentTheme = sessionUser?.themePreference || theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    try {
      if (sessionUser) {
        await dispatch(updateTheme(newTheme)); // Updates Redux and backend
      } else {
        localStorage.setItem('theme', newTheme);
        dispatch(setTheme(newTheme)); // Updates Redux for non-logged-in users
      }
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return (
    <nav className="flex flex-col items-start p-4 bg-surface shadow-md md:flex-row md:items-center md:px-8 md:justify-between dark:bg-surface-dark">
      {/* Logo Section */}
      <div className="text-2xl font-bold font-heading text-primary dark:text-primary-dark">
        <NavLink
          to="/"
          className="flex items-center no-underline transition hover:text-primary-hover dark:hover:text-primary-darkhover"
        >
          <img
            src={profolioIcon}
            alt="ProFolio LetterMark"
            className="h-10 mr-2 transition-transform hover:scale-110"
          />
          ProFolio
        </NavLink>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col items-start w-full mt-4 space-y-4 md:mt-0 md:flex-row md:items-center md:w-auto md:space-y-0 md:space-x-4">
        {/* Theme Toggle */}
        <button
          className="text-xl cursor-pointer text-text-primary transition hover:text-primary-hover dark:text-text-primary-dark dark:hover:text-primary-darkhover"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* User Actions */}
        {sessionUser ? (
          <ProfileButton />
        ) : (
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            <button
              onClick={openLoginModal}
              className="w-full px-4 py-2 text-sm font-semibold transition rounded bg-primary text-on-secondary font-body hover:bg-primary-hover dark:bg-primary-dark dark:text-on-primary-dark dark:hover:bg-primary-darkhover md:w-auto"
            >
              Log In
            </button>
            <button
              onClick={openSignupModal}
              className="w-full px-4 py-2 text-sm font-semibold transition rounded bg-secondary text-on-primary font-body hover:bg-secondary-hover dark:bg-secondary-dark dark:text-on-secondary-dark dark:hover:bg-secondary-darkhover md:w-auto"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;