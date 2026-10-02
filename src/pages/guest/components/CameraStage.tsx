import { useCamera } from "@/hooks/useCamera";

type CameraStageProps = {
  onCapture: (file: File) => void;
  onPickFromGallery: () => void;
};

export default function CameraStage({ onCapture, onPickFromGallery }: CameraStageProps) {
  const { videoRef, active, error, start, stop, capture, switchCamera } = useCamera();

  const handleCapture = async () => {
    const file = await capture();
    if (file) onCapture(file);
  };

  return (
    <section className="animate-fade-up">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-background-200 bg-foreground-950 shadow-xl shadow-foreground-950/20">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        />

        {active && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-3 top-3 h-8 w-8 rounded-tl-2xl border-l-2 border-t-2 border-accent-400/80" />
            <div className="absolute right-3 top-3 h-8 w-8 rounded-tr-2xl border-r-2 border-t-2 border-accent-400/80" />
            <div className="absolute bottom-3 left-3 h-8 w-8 rounded-bl-2xl border-b-2 border-l-2 border-accent-400/80" />
            <div className="absolute bottom-3 right-3 h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-accent-400/80" />
          </div>
        )}

        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/20">
              <i className="ri-camera-3-line text-4xl text-accent-400" />
            </div>
            <p className="text-sm leading-relaxed text-background-200">
              Activa la cámara para capturar el momento alquímico.
            </p>
            <button
              type="button"
              onClick={() => start()}
              className="flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
            >
              <i className="ri-camera-lens-fill text-lg" />
              Activar cámara
            </button>
            <button
              type="button"
              onClick={onPickFromGallery}
              className="text-xs font-medium text-accent-300 underline-offset-4 hover:underline"
            >
              o sube una foto desde tu galería
            </button>
          </div>
        )}
      </div>

      {active && (
        <div className="mt-6 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => switchCamera()}
            aria-label="Cambiar cámara"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-background-300 bg-background-50 text-foreground-700 transition-colors hover:bg-background-100"
          >
            <i className="ri-camera-switch-line text-xl" />
          </button>

          <button
            type="button"
            onClick={handleCapture}
            aria-label="Tomar foto"
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary-500/40 bg-primary-500 text-background-50 shadow-lg shadow-primary-500/30 transition-transform active:scale-95"
          >
            <i className="ri-camera-lens-fill text-3xl" />
          </button>

          <button
            type="button"
            onClick={stop}
            aria-label="Cerrar cámara"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-background-300 bg-background-50 text-foreground-700 transition-colors hover:bg-background-100"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-accent-300 bg-accent-50 px-4 py-3 text-xs text-accent-900">
          <i className="ri-error-warning-line mt-0.5 text-base" />
          <span>{error}</span>
        </div>
      )}
    </section>
  );
}