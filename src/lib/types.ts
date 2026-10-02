export type Album = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Photo = {
  id: string;
  album_id: string | null;
  guest_name: string | null;
  caption: string | null;
  image_url: string;
  storage_path: string;
  created_at: string;
  album_name?: string | null;
};

export type UploadPhotoInput = {
  file: File;
  guestName?: string;
  caption?: string;
  albumId?: string | null;
};