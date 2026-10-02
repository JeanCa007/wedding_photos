import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeImageFile } from "@/lib/image";

export type PendingPhoto = {
  id: string;
  file: File;
  url: string;
  selected: boolean;
};

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Gestiona las fotos capturadas que todavía no se han subido:
 * agregar, marcar/desmarcar, eliminar y limpiar, liberando las URLs de vista previa.
 */
export function usePendingPhotos() {
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const photosRef = useRef<PendingPhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []);

  const add = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const normalized = await Promise.all(files.map((file) => normalizeImageFile(file)));
    const next: PendingPhoto[] = normalized.map((file) => ({
      id: makeId(),
      file,
      url: URL.createObjectURL(file),
      selected: true,
    }));
    setPhotos((prev) => [...prev, ...next]);
  }, []);

  const remove = useCallback((id: string) => {
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((photo) => photo.id !== id);
    });
  }, []);

  const removeMany = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    setPhotos((prev) => {
      prev.forEach((photo) => {
        if (idSet.has(photo.id)) URL.revokeObjectURL(photo.url);
      });
      return prev.filter((photo) => !idSet.has(photo.id));
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, selected: !photo.selected } : photo,
      ),
    );
  }, []);

  const selectAll = useCallback((selected: boolean) => {
    setPhotos((prev) => prev.map((photo) => ({ ...photo, selected })));
  }, []);

  const clear = useCallback(() => {
    setPhotos((prev) => {
      prev.forEach((photo) => URL.revokeObjectURL(photo.url));
      return [];
    });
  }, []);

  return { photos, add, remove, removeMany, toggle, selectAll, clear };
}