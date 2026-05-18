'use client';

type AdminConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: AdminConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1e1232]/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[430px] rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_30px_46px_-30px_rgba(39,17,77,0.45)]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8f7ba8]">Admin Confirmation</p>
        <h2 className="mt-2 text-[1.5rem] font-bold tracking-[-0.04em] text-[#2a1842]">{title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#66557f]">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#6b5a88] transition hover:text-[#5a2ddf]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_28px_-20px_rgba(118,65,232,0.95)] transition hover:scale-[1.01]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
