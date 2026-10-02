import { useState } from "react";
import type { FormEvent } from "react";

type NameGateProps = {
  initialName?: string;
  onSubmit: (name: string) => void;
};

export default function NameGate({ initialName = "", onSubmit }: NameGateProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Escribe tu nombre para saber quién compartió cada foto.");
      return;
    }
    onSubmit(trimmed.slice(0, 40));
  };

  return (
    <section className="animate-fade-up mx-auto w-full max-w-md">
      <div className="rounded-[2rem] border border-background-200 bg-background-50 p-7 shadow-xl shadow-foreground-950/5">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-accent-500/50">
            <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dotted border-accent-400/40" />
            <i className="ri-user-heart-line text-3xl text-primary-600" />
          </div>
          <h2 className="font-heading mt-5 text-xl font-bold text-foreground-950">
            ¿Cómo te llamas?
          </h2>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-foreground-500">
            Registra tu nombre una sola vez. Así los novios sabrán quién capturó cada
            recuerdo del álbum.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="font-label text-[0.7rem] uppercase tracking-wider text-foreground-500">
            Tu nombre
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-background-200 bg-background-100 px-3.5 focus-within:border-primary-400 focus-within:bg-background-50">
            <i className="ri-user-3-line text-base text-foreground-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Winry Rockbell"
              maxLength={40}
              autoFocus
              className="w-full border-none bg-transparent py-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400"
            />
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-xs text-primary-800">
              <i className="ri-error-warning-line mt-0.5 text-base" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-camera-3-line text-lg" />
            Empezar a tomar fotos
          </button>
        </form>
      </div>
    </section>
  );
}