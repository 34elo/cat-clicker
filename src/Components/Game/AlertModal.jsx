import React from 'react';
import './AlertModal.css'; // Подключаем стили

const AlertModal = ({message, onClose}) => {
    return (
        <div className="alert-modal">
            <div className="alert-modal-content">
                <p>{message}</p> {/* Выводим сообщение */}
                <button onClick={onClose}>OK</button> {/* Кнопка для закрытия модалки */}
            </div>
        </div>
    );
};

export default AlertModal;
