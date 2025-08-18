import React from 'react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
  autoDismiss?: boolean;
  dismissTime?: number;
}

export default function Notification({ 
  type, 
  message, 
  onClose, 
  autoDismiss = true, 
  dismissTime = 5000 
}: NotificationProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // انیمیشن ورود
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (autoDismiss && onClose) {
      const timer = setTimeout(onClose, dismissTime);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onClose, dismissTime]);

  const styles = {
    success: {
      container: "bg-gradient-to-r from-green-50 via-green-100 to-green-50 border border-green-300 text-green-800 shadow-lg",
      icon: "text-green-600",
      closeButton: "text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full p-1 transition-all duration-200"
    },
    error: {
      container: "bg-gradient-to-r from-red-50 via-red-100 to-red-50 border border-red-300 text-red-800 shadow-lg",
      icon: "text-red-600",
      closeButton: "text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full p-1 transition-all duration-200"
    }
  };

  const icons = {
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div className={`px-6 py-4 rounded-xl ${styles[type].container} backdrop-blur-sm transform transition-all duration-300 ease-out ${
      isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'
    }`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${styles[type].icon} animate-pulse`}>
          {icons[type]}
        </div>
        <div className="mr-3 flex-1">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        {onClose && (
          <div className="mr-auto">
            <button
              onClick={onClose}
              className={`${styles[type].closeButton}`}
              aria-label="بستن"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

