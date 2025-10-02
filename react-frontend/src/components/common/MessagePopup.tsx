import React, { FC } from 'react';

interface MessagePopupProps {
    message: string | null; 
    isError: boolean;
}

const MessagePopup: FC<MessagePopupProps> = ({ message, isError }) => {
    if (!message) {
        return null;
    }

    const popupStyle: React.CSSProperties = {
        backgroundColor: isError ? '#dc3545' : '#28a745',
        padding: '10px',
        marginTop: '15px',
        color: 'white',
        borderRadius: '4px',
        textAlign: 'center',
        fontWeight: 'bold',
    };

    return (
        <div 
            className={`message-popup ${isError ? 'error' : 'success'}`}
            style={popupStyle}
        >
            {message}
        </div>
    );
};

export default MessagePopup;