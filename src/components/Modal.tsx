import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ClearSVG from './Clear';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  animation: ${({ isOpen }) => (isOpen ? fadeIn : fadeOut)} 0.3s ease-in-out;
  z-index: 999;
`;

const ModalWrapper = styled.div`
  width:80%;
  max-width: 640px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 1rem;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const Close = styled.div`
  cursor: pointer;
  position: absolute;
  right: 24px;
  top: 24px;
`

const ModalContent = styled.div``;

const Modal = ({ isOpen, onClose, children }: React.PropsWithChildren<ModalProps>) => {
  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOutsideClick}>
      <ModalWrapper>
        <Close onClick={()=>{
          onClose();
        }}><ClearSVG /></Close>
        <ModalContent>{children}</ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default Modal;
