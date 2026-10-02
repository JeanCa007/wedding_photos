import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDefaultAlbumId } from "@/lib/photos";
import CameraStage from "@/pages/guest/components/CameraStage";
import UploadPanel from "@/pages/guest/components/UploadPanel";

export default function GuestPage() {
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [justUploaded, setJustUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    getDefaultAlbumId()
      .then((id) => {
        if (mounted) setAlbumId(id);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const handleFile = useCallback((file: File | null | undefined) => {
    if (file) setCapturedFile(file);
  }, []);

  const handleUploaded = useCallback(() => {
    setCapturedFile(null);
    setUploadedCount((count) => count + 1);
    setJustUploaded(true);
    window.setTimeout(() => setJustUploaded(false), 4000);
  }, []);

  return (
    <div className="min-h-screen bg-background-100">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-background-200/80 bg-background-50/90 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] w-full max-w-xl items-center gap-3 px-5">
          <Link
            to="/"
            aria-label="Volver al inicio"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-background-200 bg-background-50 text-foreground-700 transition-colors hover:bg-background-100"
          >
            <i className="ri-arrow-left-line text-xl" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-base font-semibold leading-tight text-foreground-950">
              Compartir Recuerdos
            </h1>
            <p className="truncate text-[0.7rem] text-foreground-500">
              Toma una foto y únela al álbum
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1.5 text-accent-900">
            <i className="ri-image-2-line text-sm" />
            <span className="text-xs font-semibold">{uploadedCount}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-[92px]">
        <div className="animate-fade-up mb-6 overflow-hidden rounded-3xl border border-background-200 bg-foreground-950">
          <div className="relative">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20anime%20inspired%20wedding%20celebration%20hall%20with%20fairy%20lights%20and%20golden%20alchemical%20circle%20decorations%20on%20the%20wall%2C%20crimson%20drapery%2C%20soft%20bokeh%20lights%2C%20cozy%20festive%20atmosphere%2C%20painterly%20illustration%2C%20no%20people%2C%20no%20text&width=800&height=420&seq=fmab-guest-banner&orientation=landscape"
              alt="Fiesta de boda"
              className="h-36 w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-foreground-950/90 to-foreground-950/30 px-5">
              <p className="font-heading text-lg font-semibold text-background-50">
                Bienvenido a la celebración
              </p>
              <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-background-200">
                Cada foto que subas forma parte de nuestra historia.
              </p>
            </div>
          </div>
        </div>

        {justUploaded && (
          <div className="animate-fade-up mb-5 flex items-center gap-2 rounded-2xl border border-accent-300 bg-accent-50 px-4 py-3 text-sm text-accent-900">
            <i className="ri-checkbox-circle-fill text-lg" />
            ¡Foto añadida al álbum! Gracias por compartir.
          </div>
        )}

        {capturedFile ? (
          <UploadPanel
            file={capturedFile}
            albumId={albumId}
            onUploaded={handleUploaded}
            onRetake={() => setCapturedFile(null)}
          />
        ) : (
          <CameraStage
            onCapture={handleFile}
            onPickFromGallery={() => fileInputRef.current?.click()}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="mt-8 rounded-3xl border border-background-200 bg-background-50 p-5">
          <h3 className="font-heading flex items-center gap-2 text-sm font-semibold text-foreground-950">
            <i className="ri-lightbulb-flash-line text-accent-500" />
            Consejos para una buena foto
          </h3>
          <ul className="mt-3 flex flex-col gap-2 text-xs leading-relaxed text-foreground-600">
            <li className="flex items-start gap-2">
              <i className="ri-check-line mt-0.5 text-primary-500" />
              Usa buena luz, natural o cálida, para que los colores brillen.
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line mt-0.5 text-primary-500" />
              Captura momentos espontáneos: risas, bailes y abrazos.
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line mt-0.5 text-primary-500" />
              Puedes subir todas las fotos que quieras, sin límite.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}