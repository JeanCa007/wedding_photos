import { useState } from "react";
import type { Photo } from "@/lib/types";

type LightboxProps = {
  photo: Photo;
  onClose: () => void;
  onRequestDelete: (photo: Photo) => Promise<void>;
};

function formatFullDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Lightbox({ photo, onClose, onRequestDelete }: LightboxProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onRequestDelete(photo);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-950/90 px-4 py-8 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background-50/10 text-background-50 transition-colors hover:bg-background-50/20"
      >
        <i className="ri-close-line text-2xl" />
      </button>

      <div className="animate-fade-up w-full max-w-lg overflow-hidden rounded-3xl border border-background-800/60 bg-background-950/60">
        <img
          src={photo.image_url}
          alt={photo.caption ?? "Foto del álbum"}
          className="max-h-[55vh] w-full bg-foreground-950 object-contain"
        />
        <div className="p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 text-accent-400">
              <i className="ri-user-3-line text-base" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-background-50">
                {photo.guest_name ?? "Invitado anónimo"}
              </p>
              <p className="text-[0.7rem] text-background-300">
                {formatFullDate(photo.created_at)}
              </p>
            </div>
          </div>

          {photo.caption && (
            <p className="mt-3 rounded-2xl bg-background-50/5 px-4 py-3 text-xs leading-relaxed text-background-100">
              {photo.caption}
            </p>
          )}

          {photo.album_name && (
            <p className="mt-3 flex items-center gap-1.5 text-[0.7rem] text-accent-400">
              <i className="ri-folder-image-line" />
              {photo.album_name}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            {confirming ? (
              <>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="flex-1 rounded-full border border-background-700 py-3 text-sm font-medium text-background-100 transition-colors hover:bg-background-50/5"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-500 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600 disabled:opacity-60"
                >
                  {deleting ? (
                    <i className="ri-loader-4-line animate-spin text-lg" />
                  ) : (
                    <i className="ri-delete-bin-6-line text-lg" />
                  )}
                  Confirmar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-primary-400/50 py-3 text-sm font-medium text-primary-200 transition-colors hover:bg-primary-500/20"
              >
                <i className="ri-delete-bin-6-line text-lg" />
                Eliminar foto
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}