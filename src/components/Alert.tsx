// src/components/Alert.tsx
import React, {useEffect, useState} from 'react';

interface AlertProps {
  message: string;
  type: string //'success' | 'error' | 'info';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Aguarda a transição antes de chamar onClose
        }, 5000); // 5000 ms = 5 segundos

    return () => clearTimeout(timer);
    }, [onClose]);

    const getAlertClass = () => {
        switch (type) {
          case 'success':
              return 'bg-green-100 border-green-500 text-green-700';
          case 'error':
              return 'bg-red-100 border-red-500 text-red-700';
          case 'info':
              return 'bg-blue-100 border-blue-500 text-blue-700';
          case 'warning':
            return 'bg-yellow-100 border-yellow-500 text-yellow-700';
          default:
              return '';
    }
  };

  return (
    <div
      className={`fixed m-24 -right-20 w-96 border-l-4 p-4 mb-4 rounded transition-opacity duration-300 ${getAlertClass()} ${visible ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="text-lg font-bold">×</button>
      </div>
    </div>
  );
};

export default Alert;
