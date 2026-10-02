import type { PendingPhoto } from "@/hooks/usePendingPhotos";

type PendingPanelProps = {
  photos: PendingPhoto[];
  name: string;
  onNameChange: (value: string) => void;
  comment: string;
  onCommentChange: (value: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onClearAll: () => void;
  onUpload: () => void;
  onPickFromGallery: () => void;
  uploading: boolean;
  progress: { done: number; total: number };
  error: string | null;
};

export default function PendingPanel({
  photos,
  name,
  onNameChange,
  comment,
  onCommentChange,
  onToggle,
  onRemove,
  onSelectAll,
  onClearAll,
  onUpload,
  onPickFromGallery,
  uploading,
  progress,
  error,
}: PendingPanelProps) {
  const selectedCount = photos.filter((photo) => photo.selected).length;
  const allSelected = photos.length > 0 && selectedCount === photos.length;

  return (
    <section className="animate-fade-up rounded-[2rem] border border-background-200 bg-background-50 p-5 shadow-xl shadow-foreground-950/5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-base font-semibold text-foreground-950">
            Tus fotos
          </h2>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-100 px-1.5 text-xs font-semibold text-accent-900">
            {photos.length}
          </span>
        </div>
        {photos.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectAll(!allSelected)}
              className="text-xs font-medium text-secondary-700 hover:text-secondary-900"
            >
              {allSelected ? "Quitar todas" : "Elegir todas"}
            </button>
            <button
              type="button"
              onClick={onClearAll}
              disabled={uploading}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              Vaciar
            </button>
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-background-300 bg-background-100/60 px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
            <i className="ri-image-add-line text-2xl text-accent-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground-800">
              Aún no has tomado fotos
            </p>
            <p className="mt-1 text-xs text-foreground-500">
              Toma varias, revísalas aquí y decide cuáles compartir.
            </p>
          </div>
          <button
            type="button"
            onClick={onPickFromGallery}
            className="flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-4 py-2 text-xs font-medium text-foreground-700 transition-colors hover:bg-background-100"
          >
            <i className="ri-gallery-line text-base" />
            Elegir de la galería
          </button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-xs text-foreground-500">
            Toca una foto para elegir si la subes o no. La que quites no se compartirá.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                  photo.selected
                    ? "border-primary-500"
                    : "border-background-200 opacity-60 grayscale"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggle(photo.id)}
                  className="h-full w-full"
                  aria-label={photo.selected ? "Quitar de la selección" : "Añadir a la selección"}
                >
                  <img
                    src={photo.url}
                    alt="Foto capturada"
                    className="h-full w-full object-cover"
                  />
                </button>

                <span
                  className={`pointer-events-none absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border ${
                    photo.selected
                      ? "border-primary-500 bg-primary-500 text-background-50"
                      : "border-background-50 bg-foreground-950/40 text-transparent"
                  }`}
                >
                  <i className="ri-check-line text-sm" />
                </span>

                <button
                  type="button"
                  onClick={() => onRemove(photo.id)}
                  disabled={uploading}
                  aria-label="Eliminar foto"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground-950/60 text-background-50 backdrop-blur-sm transition-colors hover:bg-primary-600 disabled:opacity-50"
                >
                  <i className="ri-delete-bin-6-line text-sm" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <div>
              <label className="font-label text-[0.7rem] uppercase tracking-wider text-foreground-500">
                Tu nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
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
                value={comment}
                onChange={(e) => onCommentChange(e.target.value.slice(0, 500))}
                placeholder="Un mensaje para los novios o descripción de las fotos..."
                rows={3}
                disabled={uploading}
                className="mt-1.5 w-full resize-none rounded-xl border border-background-200 bg-background-100 px-4 py-2.5 text-sm text-foreground-900 outline-none transition-colors placeholder:text-foreground-400 focus:border-primary-400 focus:bg-background-50 disabled:opacity-60"
              />
              <p className="mt-1 text-right text-[0.65rem] text-foreground-400">
                {comment.length}/500
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
            onClick={onUpload}
            disabled={uploading || selectedCount === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <i className="ri-loader-4-line animate-spin text-lg" />
                Subiendo {progress.done}/{progress.total}...
              </>
            ) : (
              <>
                <i className="ri-upload-cloud-2-line text-lg" />
                Subir {selectedCount} {selectedCount === 1 ? "foto" : "fotos"} al álbum
              </>
            )}
          </button>
        </>
      )}
    </section>
  );
}