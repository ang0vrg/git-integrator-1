import React, { FC, useEffect, useState } from 'react';

interface MessagePopupProps {
    message: string | null; 
    isError: boolean;
}

const MessagePopup: FC<MessagePopupProps> = ({ message, isError }) => {
  /* control interno para animar entrada/salida */
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [message]);

  if (!message && !show) return null;

  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white text-sm font-semibold z-50 transition-all duration-300
                  ${
                    show
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }
                  ${isError ? "bg-red-600" : "bg-green-600"}`}
    >
      {message}
    </div>
  );
};

export default MessagePopup;