import { toast as sonner } from 'sonner';

// Copied from sonner
type ToastTypes =
  | 'normal'
  | 'action'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'loading'
  | 'default';
type ToastId = number | string;

/* -------------------------------------------------------------------------- */
/*                                  PROGRESS                                  */
/* -------------------------------------------------------------------------- */
/* -------------------------------- INTERNAL -------------------------------- */
// Init and update a progress toast
const init = (title: string, description: string) => {
  return sonner.loading(title, { description });
};

const update = (
  id: ToastId,
  title: string,
  description: string,
  type: ToastTypes = 'loading',
) => {
  // We can safely ignore the following since we copied the types from sonner
  // @ts-ignore
  sonner[type](title, { id, description, closeButton: type !== 'loading' });
};

/* -------------------------------- EXTERNAL -------------------------------- */
/**
 * @notice A class to manage progress toasts
 */
const toastProgress = {
  // Init a progress toast with a loading state
  onStart: (title: string, description: string) => {
    return init(title, description);
  },

  // Update the progress toast with a new message
  onProgress: (id: ToastId, title: string, description: string) => {
    update(id, title, description);
  },

  // End the progress toast with a success state
  onSuccess: (id: ToastId, title: string, description: string) => {
    update(id, title, description, 'success');
  },

  // End the progress toast with an error state
  onError: (id: ToastId, title: string, description: string) => {
    update(id, title, description, 'error');
  },
};

export { toastProgress };
