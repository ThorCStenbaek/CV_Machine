import React from 'react';

const Modal = ({ isOpen, onClose, children, style }) => {
    if (!isOpen) return null;

    const handleOutsideClick = (e) => {
        onClose();
        console.log("closing modal")
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div  className="modal" onClick={handleOutsideClick}>
            <div style={style} className="modal-content" onClick={handleContentClick}>
                <span className="close" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;
