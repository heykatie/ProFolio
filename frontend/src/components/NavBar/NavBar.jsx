import {useState} from 'react';
import ReactModal from 'react-modal';
import LoginModal from '../LoginModal';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/session';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
		<nav className='navbar'>
			<div className='navbar-logo'>
				<NavLink to='/' className='navbar-brand'>
					ProFolio
				</NavLink>
			</div>

			<div className='navbar-links'>
				{sessionUser ? (
					<>
						<NavLink to='/dashboard' className='navbar-link'>
							Dashboard
						</NavLink>
						<NavLink to='/settings' className='navbar-link'>
							Settings
						</NavLink>
						<button onClick={handleLogout} className='navbar-button'>
							Log Out
						</button>
					</>
				) : (
					<>
						<NavLink to='/signup' className='navbar-link'>
							Sign Up
						</NavLink>
							<div>
								<button onClick={() => setIsModalOpen(true)}>
									Log In
								</button>
								<ReactModal
									isOpen={isModalOpen}
									onRequestClose={() => setIsModalOpen(false)}
									ariaHideApp={false}>
									<LoginModal
										closeModal={() => setIsModalOpen(false)}
									/>
								</ReactModal>
							</div>
					</>
				)}
			</div>
		</nav>
  );
};

export default Navbar;