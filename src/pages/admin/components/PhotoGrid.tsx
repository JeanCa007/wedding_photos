import type { Photo } from "@/lib/types";

type PhotoGridProps = {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PhotoGrid({ photos, onSelect }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onSelect(photo)}
          className="animate-fade-up group relative aspect-square overflow-hidden rounded-2xl border border-background-200 bg-background-100 text-left"
          style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
        >
          <img
            src={photo.image_url}
            alt={photo.caption ?? "Foto del álbum"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground-950/85 to-transparent p-2.5">
            <p className="truncate text-[0.7rem] font-medium text-background-50">
              {photo.guest_name ?? "Invitado anónimo"}
            </p>
            <p className="truncate text-[0.6rem] text-background-200">
              {formatDate(photo.created_at)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}