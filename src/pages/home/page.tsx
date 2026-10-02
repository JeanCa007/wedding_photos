import { Link } from "react-router-dom";

const options = [
  {
    to: "/guest",
    image:
      "https://readdy.ai/api/search-image?query=A%203D%20cartoon%20icon%20of%20a%20vintage%20leather%20camera%20with%20a%20glowing%20gold%20alchemical%20circle%20engraved%20on%20it%2C%20a%20single%20object%20that%20fills%20about%2070%25%20of%20the%20frame%2C%20isolated%20on%20a%20clean%20warm%20cream%20background%20with%20a%20centered%20composition%2C%20soft%20studio%20lighting%2C%20subtle%20shadows%2C%20crimson%20and%20antique%20gold%20palette%2C%20clean%20modern%20render&width=600&height=600&seq=fmab-guest-camera&orientation=squarish",
    title: "Soy invitado",
    description: "Activa tu cámara, toma fotos y compártelas al instante en el álbum.",
    icon: "ri-camera-3-line",
    accent: "primary" as const,
  },
  {
    to: "/admin",
    image:
      "https://readdy.ai/api/search-image?query=A%203D%20cartoon%20icon%20of%20an%20antique%20leather%20ledger%20book%20with%20a%20glowing%20gold%20alchemical%20symbol%20on%20the%20cover%2C%20a%20single%20object%20that%20fills%20about%2070%25%20of%20the%20frame%2C%20isolated%20on%20a%20clean%20warm%20cream%20background%20with%20a%20centered%20composition%2C%20soft%20studio%20lighting%2C%20subtle%20shadows%2C%20crimson%20and%20antique%20gold%20palette%2C%20clean%20modern%20render&width=600&height=600&seq=fmab-admin-ledger&orientation=squarish",
    title: "Soy administrador",
    description: "Inicia sesión y contempla el álbum completo con todas las fotos.",
    icon: "ri-book-2-line",
    accent: "secondary" as const,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-foreground-950">
      <img
        src="https://readdy.ai/api/search-image?query=Atmospheric%20dark%20crimson%20and%20antique%20gold%20wedding%20hall%20inspired%20by%20classic%20anime%20alchemy%2C%20glowing%20transmutation%20circle%20pattern%20on%20an%20old%20stone%20floor%2C%20floating%20dust%20particles%2C%20candles%2C%20deep%20shadows%2C%20cinematic%20moody%20lighting%2C%20painterly%20illustration%2C%20no%20people%2C%20no%20text%2C%20elegant%20mysterious%20composition&width=900&height=1400&seq=fmab-wedding-hero&orientation=portrait"
        alt="Ambientación alquímica de boda"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground-950/70 via-foreground-950/85 to-foreground-950" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 pb-12 pt-14 lg:max-w-4xl lg:pt-20">
        <header className="animate-fade-up text-center">
          <p className="font-label text-[0.7rem] uppercase tracking-[0.35em] text-accent-400">
            Fullmetal Alchemist Brotherhood
          </p>
          <h1 className="font-heading mt-4 text-4xl font-bold leading-tight text-background-50 lg:text-6xl">
            Álbum de Boda
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-background-200 lg:text-base">
            Una hermandad de recuerdos. Captura cada instante y guárdalo para siempre.
          </p>
        </header>

        <div className="mt-8 flex justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-accent-500/50">
            <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dotted border-accent-400/40" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/20">
              <i className="ri-flask-line text-3xl text-accent-400" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {options.map((option, index) => (
            <Link
              key={option.to}
              to={option.to}
              className="animate-fade-up group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-background-800/60 bg-background-50/[0.06] p-4 backdrop-blur-md transition-all duration-300 hover:border-accent-500/50 hover:bg-background-50/[0.1] lg:flex-col lg:items-start lg:gap-5 lg:p-6"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-background-200/20 lg:h-32 lg:w-full">
                <img
                  src={option.image}
                  alt={option.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      option.accent === "primary"
                        ? "bg-primary-500/25 text-primary-200"
                        : "bg-secondary-500/25 text-secondary-100"
                    }`}
                  >
                    <i className={`${option.icon} text-sm`} />
                  </span>
                  <h2 className="font-heading text-lg font-semibold text-background-50">
                    {option.title}
                  </h2>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-background-200 lg:text-sm">
                  {option.description}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-foreground-950 transition-transform duration-300 group-hover:translate-x-1 lg:absolute lg:right-6 lg:top-6">
                <i className="ri-arrow-right-line text-lg" />
              </span>
            </Link>
          ))}
        </div>

        <footer className="mt-auto pt-10 text-center">
          <p className="font-heading text-xs tracking-[0.25em] text-accent-500/70">
            ✦ UN SOLO RECUERDO, TODAS LAS MANOS ✦
          </p>
        </footer>
      </div>
    </div>
  );
}