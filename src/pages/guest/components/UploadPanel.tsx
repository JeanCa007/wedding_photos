import { useEffect, useState } from "react";
import { uploadPhoto } from "@/lib/photos";

type UploadPanelProps = {
  file: File;
  albumId: string | null;
  onUploaded: () => void;
  onRetake: () => void;
};

export default function UploadPanel({ file, albumId, onUploaded, onRetake }: UploadPanelProps) {
  const [preview, setPreview] = useState<string>("");
  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    try {
      await uploadPhoto({ file, guestName, caption, albumId });
      onUploaded();
    } catch (_e) {
      setError("No pudimos subir la foto. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="animate-fade-up rounded-[2rem] border border-background-200 bg-background-50 p-5 shadow-xl shadow-foreground-950/5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-foreground-950">
          Enviar al álbum
        </h2>
        <button
          type="button"
          onClick={onRetake}
          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          <i className="ri-refresh-line" />
          Repetir
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-background-200">
        <img src={preview} alt="Vista previa de la foto" className="h-56 w-full object-cover" />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <label className="font-label text-[0.7rem] uppercase tracking-wider text-foreground-500">
            Tu nombre (opcional)
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Ej. Winry Rockbell"
            maxLength={40}
            className="mt-1.5 w-full rounded-xl border border-background-200 bg-background-100 px-4 py-2.5 text-sm text-foreground-900 outline-none transition-colors placeholder:text-foreground-400 focus:border-primary-400 focus:bg-background-50"
          />
        </div>

        <div>
          <label className="font-label text-[0.7rem] uppercase tracking-wider text-foreground-500">
            Comentario (opcional)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 500))}
            placeholder="Cuéntanos qué está pasando en esta foto..."
            rows={3}
            className="mt-1.5 w-full resize-none rounded-xl border border-background-200 bg-background-100 px-4 py-2.5 text-sm text-foreground-900 outline-none transition-colors placeholder:text-foreground-400 focus:border-primary-400 focus:bg-background-50"
          />
          <p className="mt-1 text-right text-[0.65rem] text-foreground-400">
            {caption.length}/500
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-xs text-primary-800">
          <i className="ri-error-warning-line mt-0.5 text-base" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? (
          <>
            <i className="ri-loader-4-line animate-spin text-lg" />
            Subiendo...
          </>
        ) : (
          <>
            <i className="ri-upload-cloud-2-line text-lg" />
            Subir al álbum
          </>
        )}
      </button>
    </section>
  );
}