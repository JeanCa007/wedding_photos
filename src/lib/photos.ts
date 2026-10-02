import { supabase, STORAGE_BUCKET } from "./supabase";
import type { Photo, UploadPhotoInput } from "./types";

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function getDefaultAlbumId(): Promise<string | null> {
  const { data, error } = await supabase
    .from("albums")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data?.id ?? null;
}

export async function uploadPhoto(input: UploadPhotoInput): Promise<Photo> {
  const { file, guestName, caption, albumId } = input;
  const folder = albumId ?? "general";
  const path = `${folder}/${Date.now()}-${randomId()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: "image/jpeg", upsert: false });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  const imageUrl = urlData.publicUrl;

  const { data, error } = await supabase
    .from("photos")
    .insert({
      album_id: albumId ?? null,
      guest_name: guestName?.trim() ? guestName.trim() : null,
      caption: caption?.trim() ? caption.trim() : null,
      image_url: imageUrl,
      storage_path: path,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Photo;
}

export async function fetchPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("photos")
    .select(
      "id, album_id, guest_name, caption, image_url, storage_path, created_at, albums(name)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => {
    const record = row as unknown as Record<string, unknown>;
    const albumRelation = record.albums as { name?: string } | null;
    return {
      id: record.id as string,
      album_id: (record.album_id as string) ?? null,
      guest_name: (record.guest_name as string) ?? null,
      caption: (record.caption as string) ?? null,
      image_url: record.image_url as string,
      storage_path: record.storage_path as string,
      created_at: record.created_at as string,
      album_name: albumRelation?.name ?? null,
    } satisfies Photo;
  });
}

export async function deletePhoto(photo: Photo): Promise<void> {
  if (photo.storage_path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([photo.storage_path]);
  }
  const { error } = await supabase.from("photos").delete().eq("id", photo.id);
  if (error) throw error;
}