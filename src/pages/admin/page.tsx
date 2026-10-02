import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN_EMAIL, ADMIN_USERNAME, supabase } from "@/lib/supabase";
import { deletePhoto, fetchPhotos } from "@/lib/photos";
import type { Photo } from "@/lib/types";
import LoginCard from "@/pages/admin/components/LoginCard";
import PhotoGrid from "@/pages/admin/components/PhotoGrid";
import Lightbox from "@/pages/admin/components/Lightbox";

export default function AdminPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [query, setQuery] = useState("");

  const loadPhotos = useCallback(async () => {
    setLoadingPhotos(true);
    setLoadError(null);
    try {
      const data = await fetchPhotos();
      setPhotos(data);
    } catch (_e) {
      setLoadError("No pudimos cargar el álbum. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setLoadingPhotos(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setIsAuthed(Boolean(data.session));
        setCheckingSession(false);
      })
      .catch(() => {
        if (!mounted) return;
        setIsAuthed(false);
        setCheckingSession(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthed) loadPhotos();
  }, [isAuthed, loadPhotos]);

  const handleLogin = useCallback(
    async (username: string, password: string): Promise<string | null> => {
      try {
        await supabase.functions.invoke("seed-admin", { body: {} });
      } catch (_e) {
        /* la cuenta ya podría existir */
      }
      const email = username.toLowerCase() === ADMIN_USERNAME ? ADMIN_EMAIL : username;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return "Usuario o contraseña incorrectos. Prueba con admin / 123456.";
      setIsAuthed(true);
      return null;
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setPhotos([]);
    setIsAuthed(false);
    setSelected(null);
  }, []);

  const handleDelete = useCallback(async (photo: Photo) => {
    await deletePhoto(photo);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return photos;
    return photos.filter((photo) =>
      `${photo.guest_name ?? ""} ${photo.caption ?? ""}`.toLowerCase().includes(term),
    );
  }, [photos, query]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-100">
        <div className="flex flex-col items-center gap-3 text-foreground-500">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500" />
          <p className="text-xs">Comprobando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <LoginCard onSubmit={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background-100">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-background-200/80 bg-background-50/90 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] w-full max-w-5xl items-center gap-3 px-5">
          <Link
            to="/"
            aria-label="Volver al inicio"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-background-200 bg-background-50 text-foreground-700 transition-colors hover:bg-background-100"
          >
            <i className="ri-arrow-left-line text-xl" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-base font-semibold leading-tight text-foreground-950">
              Álbum de la Boda
            </h1>
            <p className="truncate text-[0.7rem] text-foreground-500">
              {photos.length} {photos.length === 1 ? "foto" : "fotos"} en total
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-background-200 bg-background-50 px-3.5 py-2 text-xs font-medium text-foreground-700 transition-colors hover:bg-background-100"
          >
            <i className="ri-logout-box-r-line" />
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-[92px]">
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-background-200 bg-background-50 px-4 py-1.5 focus-within:border-primary-400">
          <i className="ri-search-line text-base text-foreground-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por invitado o comentario..."
            className="w-full border-none bg-transparent py-2 text-sm text-foreground-900 outline-none placeholder:text-foreground-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              className="flex h-7 w-7 items-center justify-center rounded-full text-foreground-400 hover:text-foreground-700"
            >
              <i className="ri-close-line" />
            </button>
          )}
        </div>

        {loadingPhotos && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-background-200"
              />
            ))}
          </div>
        )}

        {!loadingPhotos && loadError && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-primary-200 bg-primary-50 px-6 py-12 text-center">
            <i className="ri-cloud-off-line text-4xl text-primary-500" />
            <p className="text-sm text-primary-800">{loadError}</p>
            <button
              type="button"
              onClick={loadPhotos}
              className="flex items-center gap-2 rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
            >
              <i className="ri-refresh-line" />
              Reintentar
            </button>
          </div>
        )}

        {!loadingPhotos && !loadError && photos.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-background-300 bg-background-50 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
              <i className="ri-image-add-line text-3xl text-accent-700" />
            </div>
            <div>
              <p className="font-heading text-base font-semibold text-foreground-950">
                El álbum está vacío
              </p>
              <p className="mt-1 text-xs text-foreground-500">
                Cuando los invitados suban fotos, aparecerán aquí al instante.
              </p>
            </div>
          </div>
        )}

        {!loadingPhotos && !loadError && photos.length > 0 && filtered.length === 0 && (
          <div className="rounded-3xl border border-background-200 bg-background-50 px-6 py-12 text-center">
            <i className="ri-search-eye-line text-3xl text-foreground-400" />
            <p className="mt-3 text-sm text-foreground-600">
              No encontramos fotos para "{query}".
            </p>
          </div>
        )}

        {!loadingPhotos && !loadError && filtered.length > 0 && (
          <PhotoGrid photos={filtered} onSelect={setSelected} />
        )}
      </main>

      {selected && (
        <Lightbox
          photo={selected}
          onClose={() => setSelected(null)}
          onRequestDelete={handleDelete}
        />
      )}
    </div>
  );
}