import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

type LoginCardProps = {
  onSubmit: (username: string, password: string) => Promise<string | null>;
};

export default function LoginCard({ onSubmit }: LoginCardProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Escribe tu usuario y contraseña.");
      return;
    }
    setLoading(true);
    setError(null);
    const message = await onSubmit(username.trim(), password);
    if (message) setError(message);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-100 px-5 py-10">
      <div className="animate-fade-up w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-accent-500/50">
            <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dotted border-accent-400/40" />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/15">
              <i className="ri-shield-user-line text-3xl text-primary-600" />
            </div>
          </div>
          <h1 className="font-heading mt-5 text-2xl font-bold text-foreground-950">
            Acceso Administrador
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-foreground-500">
            Solo los organizadores pueden ver el álbum completo de la boda.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-background-200 bg-background-50 p-6 shadow-xl shadow-foreground-950/5"
        >
          <label className="font-label text-[0.7rem] uppercase tracking-wider text-foreground-500">
            Usuario
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-background-200 bg-background-100 px-3.5 focus-within:border-primary-400 focus-within:bg-background-50">
            <i className="ri-user-3-line text-base text-foreground-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="w-full border-none bg-transparent py-2.5 text-sm text-foreground-900 outline-none placeholder:text-foreground-400"
            />
          </div>

          <label className="font-label mt-4 block text-[0.7rem] uppercase tracking-wider text-foreground-500">
            Contraseña
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-background-200 bg-background-100 px-3.5 focus-within:border-primary-400 focus-within:bg-background-50">
            <i className="ri-lock-2-line text-base text-foreground-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
              className="w-full border-none bg-transparent py-2.5 text-sm text-foreground-900 outline-none placeholder:text-foreground-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="flex h-7 w-7 items-center justify-center rounded-full text-foreground-400 hover:text-foreground-700"
            >
              <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-xs text-primary-800">
              <i className="ri-error-warning-line mt-0.5 text-base" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin text-lg" />
                Entrando...
              </>
            ) : (
              <>
                <i className="ri-login-box-line text-lg" />
                Entrar al álbum
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-foreground-400">
          ¿Eres invitado? <Link to="/" className="text-primary-600 hover:underline">Vuelve al inicio</Link>
        </p>
      </div>
    </div>
  );
}