import { useNotifications } from '@mantine/notifications';
import { FiCheck } from 'react-icons/fi';

type ToastConfig = {
  title?: string;
  color?: string;
  icon?: React.ReactNode;
};

export const useToasts = () => {
  const notifications = useNotifications();

  const toasts = {
    success: (message: string, config?: ToastConfig) => {
      return notifications.showNotification({
        title: config?.title || 'Success',
        message,
        color: config?.color || 'teal',
        icon: <FiCheck />,
      });
    },
    error: (message: string, config?: ToastConfig) => {
      return notifications.showNotification({
        title: config?.title || 'Error',
        message,
        color: config?.color || 'red',
        icon: '!',
      });
    },
    warning: (message: string, config?: ToastConfig) => {
      return notifications.showNotification({
        title: config?.title || 'Warning',
        message,
        color: config?.color || 'yellow',
        icon: '!',
      });
    },
    info: (message: string, config?: ToastConfig) => {
      return notifications.showNotification({
        title: config?.title || 'Info',
        message,
        color: config?.color || 'blue',
        icon: 'i',
      });
    },
  };

  return toasts;
};
