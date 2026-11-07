import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from '../../components/ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'تایید',
  danger = true,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-3 mb-5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            danger ? 'bg-red-500/10' : 'bg-amber-500/10'
          }`}
        >
          <AlertTriangle
            className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-amber-500'}`}
          />
        </div>
        <p className="text-sm text-ink/70 dark:text-night-ink/70 leading-relaxed pt-1">
          {message}
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose}>
          انصراف
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={danger ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}