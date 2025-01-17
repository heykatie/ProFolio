import React, { createContext, useState, useContext } from 'react';
import ReactDOM from 'react-dom';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
	const [modalContent, setModalContent] = useState(null);
	const [onModalClose, setOnModalClose] = useState(null);

	const closeModal = () => {
		if (onModalClose) onModalClose(); // Execute any cleanup function
		setModalContent(null);
		setOnModalClose(null);
	};

	return (
		<ModalContext.Provider
			value={{ setModalContent, setOnModalClose, closeModal }}>
			{children}
			{modalContent &&
				ReactDOM.createPortal(
					<div className='modal-overlay' onClick={closeModal}>
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
