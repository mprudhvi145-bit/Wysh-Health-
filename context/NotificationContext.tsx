
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  addNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);

    // Auto dismiss
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id}
            className={`
              pointer-events-auto min-w-[300px] p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-start gap-3 animate-slideDown
              ${n.type === 'success' ? 'bg-teal/10 border-teal/30 text-white' : ''}
              ${n.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-white' : ''}
              ${n.type === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-white' : ''}
            `}
          >
            {n.type === 'success' && <CheckCircle size={20} className="text-teal mt-0.5" />}
            {n.type === 'error' && <AlertCircle size={20} className="text-red-400 mt-0.5" />}
            {n.type === 'info' && <Info size={20} className="text-blue-400 mt-0.5" />}
            
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">{n.message}</p>
            </div>
            
            <button onClick={() => removeNotification(n.id)} className="opacity-60 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
