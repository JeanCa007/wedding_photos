import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDefaultAlbumId, uploadPhoto } from "@/lib/photos";
import { usePendingPhotos } from "@/hooks/usePendingPhotos";
import CameraStage from "@/pages/guest/components/CameraStage";
import PendingPanel from "@/pages/guest/components/PendingPanel";
import NameGate from "@/pages/guest/components/NameGate";

const NAME_STORAGE_KEY = "fmab-guest-name";

export default function GuestPage() {
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [name, setName] = useState<string>(() => {
    try {
      return localStorage.getItem(NAME_STORAGE_KEY) ?? "";
    } catch (_e) {
      return "";
    }
  });
  const [comment, setComment] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { photos, add, remove, removeMany, toggle, selectAll, clear } = usePendingPhotos();

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

  useEffect(() => {
    try {
      if (name) localStorage.setItem(NAME_STORAGE_KEY, name);
    } catch (_e) {
      /* almacenamiento no disponible */
    }
  }, [name]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const handleCapture = useCallback(
    (file: File) => {
      add([file]);
    },
    [add],
  );

  const handleGallery = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      add(Array.from(files));
    },
    [add],
  );

  const handleUpload = useCallback(async () => {
    const target = photos.filter((photo) => photo.selected);
    if (target.length === 0) {
      setError("Elige al menos una foto para subir.");
      return;
    }
    setUploading(true);
    setError(null);
    setNotice(null);
    setProgress({ done: 0, total: target.length });

    const uploadedIds: string[] = [];
    let failed = 0;
    for (let i = 0; i < target.length; i += 1) {
      const photo = target[i];
      try {
        await uploadPhoto({ file: photo.file, guestName: name, caption: comment, albumId });
        uploadedIds.push(photo.id);
      } catch (_e) {
        failed += 1;
      }
      setProgress({ done: i + 1, total: target.length });
    }

    removeMany(uploadedIds);
    if (uploadedIds.length > 0) {
      setUploadedCount((count) => count + uploadedIds.length);
    }

    if (failed === 0) {
      setNotice(
        `${uploadedIds.length} ${uploadedIds.length === 1 ? "foto añadida" : "fotos añadidas"} al álbum. ¡Gracias por compartir!`,
      );
    } else if (uploadedIds.length > 0) {
      setNotice(`${uploadedIds.length} subidas. ${failed} no se pudieron subir, inténtalo de nuevo.`);
      setError("Algunas fotos no se pudieron subir. Revisa tu conexión e inténtalo otra vez.");
    } else {
      setError("No pudimos subir las fotos. Revisa tu conexión e inténtalo de nuevo.");
    }
    setUploading(false);
  }, [photos, name, comment, albumId, removeMany]);

  const showNameGate = name.trim().length < 2;

  return (
    <div className="min-h-screen bg-background-100">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-background-200/80 bg-background-50/90 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] w-full max-w-2xl items-center gap-3 px-5 lg:max-w-6xl">
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
              {showNameGate ? "Registra tu nombre para empezar" : `Invitado: ${name}`}
            </p>
          </div>
          {photos.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-secondary-100 px-3 py-1.5 text-secondary-900">
              <i className="ri-camera-3-line text-sm" />
              <span className="text-xs font-semibold">{photos.length}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1.5 text-accent-900">
            <i className="ri-image-2-line text-sm" />
            <span className="text-xs font-semibold">{uploadedCount}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-[92px] lg:max-w-6xl">
        {showNameGate ? (
          <div className="pt-6 lg:pt-12">
            <NameGate initialName={name} onSubmit={setName} />
          </div>
        ) : (
          <>
            <div className="animate-fade-up mb-6 overflow-hidden rounded-3xl border border-background-200 bg-foreground-950">
              <div className="relative">
                <img
                  src="https://readdy.ai/api/search-image?query=Warm%20anime%20inspired%20wedding%20celebration%20hall%20with%20fairy%20lights%20and%20golden%20alchemical%20circle%20decorations%20on%20the%20wall%2C%20crimson%20drapery%2C%20soft%20bokeh%20lights%2C%20cozy%20festive%20atmosphere%2C%20painterly%20illustration%2C%20no%20people%2C%20no%20text&width=1200&height=420&seq=fmab-guest-banner&orientation=landscape"
                  alt="Fiesta de boda"
                  className="h-32 w-full object-cover opacity-80 lg:h-40"
                />
                <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-foreground-950/90 to-foreground-950/20 px-6">
                  <p className="font-heading text-lg font-semibold text-background-50">
                    Bienvenido a la celebración
                  </p>
                  <p className="mt-1 max-w-md text-xs leading-relaxed text-background-200">
                    Toma todas las fotos que quieras, revísalas y comparte solo las que más te
                    gusten.
                  </p>
                </div>
              </div>
            </div>

            {notice && (
              <div className="animate-fade-up mb-5 flex items-center gap-2 rounded-2xl border border-accent-300 bg-accent-50 px-4 py-3 text-sm text-accent-900">
                <i className="ri-checkbox-circle-fill text-lg" />
                {notice}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
              <CameraStage
                pendingCount={photos.length}
                onCapture={handleCapture}
                onPickFromGallery={() => fileInputRef.current?.click()}
              />

              <PendingPanel
                photos={photos}
                name={name}
                onNameChange={setName}
                comment={comment}
                onCommentChange={setComment}
                onToggle={toggle}
                onRemove={remove}
                onSelectAll={selectAll}
                onClearAll={clear}
                onUpload={handleUpload}
                onPickFromGallery={() => fileInputRef.current?.click()}
                uploading={uploading}
                progress={progress}
                error={error}
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleGallery(e.target.files);
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
          </>
        )}
      </main>
    </div>
  );
}