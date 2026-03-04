import { useToast } from 'vue-toastification';

export function useNotification() {
  const toast = useToast();

  const showSuccess = (message, title = 'Sucesso!') => {
    toast.success(message, {
      title,
    });
  };

  const showError = (message, title = 'Erro!') => {
    toast.error(message, {
      title,
    });
  };

  const showInfo = (message, title = 'Informação') => {
    toast.info(message, {
      title,
    });
  };

  const showWarning = (message, title = 'Aviso') => {
    toast.warning(message, {
      title,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    toast,
  };
}
