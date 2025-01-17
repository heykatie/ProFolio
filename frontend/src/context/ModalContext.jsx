import { createContext, useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import './ModalContext.css'
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
	const [modalContent, setModalContent] = useState(null);
	const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
		if (onModalClose) onModalClose();
		setModalContent(null);
		setOnModalClose(null);
	};

	return (
		<ModalContext.Provider
			value={{ setModalContent, setOnModalClose, closeModal }}>
			{children}
			{modalContent &&
				ReactDOM.createPortal(
					<div
						className='modal-overlay'
						onClick={(e) => {
							if (e.target === e.currentTarget) closeModal();
						}}>
						<div
							className='modal-content'
							onClick={(e) => e.stopPropagation()}>
							{modalContent}
						</div>
					</div>,
					document.body
				)}
		</ModalContext.Provider>
	);
};

export const useModal = () => useContext(ModalContext);
