import {
  ArrowRight,
  BellRing,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  EyeOff,
  GraduationCap,
  ListChecks,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  TimerReset,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Feature = {
  title: string;
  eyebrow: string;
  description: string;
  video: string;
  icon: LucideIcon;
  accent: "mint" | "sky" | "sun" | "coral" | "ink" | "lime";
};

const featureReel: Feature[] = [
  {
    title: "Jadwal kuliah yang kebaca",
    eyebrow: "SIAP",
    description:
      "Ambil jadwal dari portal kampus, tampilkan rapi, dan bantu kamu ingat ritme minggu ini.",
    video: "/video/vid-jadwal-2.mp4",
    icon: CalendarDays,
    accent: "sky",
  },
  {
    title: "IPK dan progres akademik",
    eyebrow: "Akademik",
    description:
      "Pantau performa tanpa perlu bolak-balik buka halaman yang sama tiap semester.",
    video: "/video/vid-ipk.mp4",
    icon: GraduationCap,
    accent: "mint",
  },
  {
    title: "LearnSocial jadi lebih enak",
    eyebrow: "Belajar",
    description:
      "Bikin platform belajar terasa lebih ringan dipakai buat tugas dan materi harian.",
    video: "/video/vid-learnsocial.mp4",
    icon: BookOpenCheck,
    accent: "lime",
  },
  {
    title: "PBM auto-fill biar nggak capek",
    eyebrow: "Form",
    description:
      "Beresin form rutin lebih cepat, cocok buat urusan yang repetitif tapi tetap harus kelar.",
    video: "/video/Vid-Pbm.mp4",
    icon: ClipboardCheck,
    accent: "sun",
  },
  {
    title: "Food Truck helper",
    eyebrow: "Kampus",
    description:
      "Helper kecil buat flow pendaftaran yang sering rebutan waktu dan butuh gerak cepat.",
    video: "/video/vid-foodtruk.mp4",
    icon: TimerReset,
    accent: "coral",
  },
  {
    title: "Theme dan privacy tools",
    eyebrow: "Nyaman",
    description:
      "Dark mode, tema, blur data pribadi, dan helper browser lain buat sesi kuliah panjang.",
    video: "/video/Vid-Theme.mp4",
    icon: EyeOff,
    accent: "ink",
  },
];

const painPoints = [
  "Jadwal, IPK, tugas, form, dan portal kampus sering kepencar.",
  "Banyak klik kecil yang rasanya receh, tapi numpuk tiap minggu.",
  "Butuh helper yang ngerti konteks mahasiswa Undip, bukan dashboard kantor.",
];

const workflow = [
  {
    title: "Pasang extension",
    description: "Build atau install, lalu pin Siap Dips di browser kamu.",
    icon: Rocket,
  },
  {
    title: "Atur yang kamu butuh",
    description: "Nyalain fitur kampus, Todoist, AI, atau helper otomatis seperlunya.",
    icon: WandSparkles,
  },
  {
    title: "Buka portal seperti biasa",
    description: "Siap Dips kerja di halaman yang didukung tanpa bikin flow kamu ribet.",
    icon: CheckCircle2,
  },
];

const storeLinks = [
  {
    name: "Chrome Web Store",
    href: "https://chromewebstore.google.com/detail/siap-dips-your-campus-com/inpmbpkngacgeljphlapgdgdjmoffild",
    label: "Install Chrome",
  },
  {
    name: "Firefox Add-ons",
    href: "https://addons.mozilla.org/en-US/firefox/addon/siap-dips/",
    label: "Install Firefox",
  },
  {
    name: "Microsoft Edge Add-ons",
    href: "https://microsoftedge.microsoft.com/addons/detail/siap-dips-your-campus-co/hlmmkdnclolciolbhaacjmphkmbceopl",
    label: "Install Edge",
  },
];

function LogoSiapDips(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 283.46 283.46"
      aria-hidden="true"
      {...props}
    >
      <path
        d="m94.86,34.25l1.76,30.39c-8.19-.18-14.5-.15-18.92.09-14.12.82-21.15,6.09-21.11,15.79.05,9.27,7.4,13.87,22.06,13.8,7.22-.04,14.6-1.8,22.13-5.28,4.84-2.29,11.88-6.91,21.12-13.85l22.56-15.31c12.25-8.25,22.41-14.18,30.48-17.78,11.08-4.9,21.96-7.38,32.63-7.43,14.01-.07,25.24,3.65,33.69,11.16,9.42,8.25,14.16,19.55,14.23,33.89.07,14.66-5.16,25.68-15.69,33.06-8.17,5.86-19.04,8.93-32.62,9.21-1.08,0-4.8.02-11.16.05l-3.22-30.22c9.59-.05,16.33-.35,20.21-.91,9.26-1.34,13.88-5.62,13.84-12.84-.04-8.63-6.96-12.9-20.76-12.83-7.76.04-14.92,1.85-21.48,5.44-3.98,2.18-12.52,7.66-25.63,16.46l-22.73,15.63c-21.49,14.87-42.21,22.36-62.15,22.46-11.86.06-21.57-2.43-29.14-7.46-11.25-7.38-16.91-19.75-17-37.11-.08-16.39,5.47-28.7,16.64-36.95,5.91-4.45,12.2-7.28,18.88-8.5,5.38-.89,11.96-1.35,19.72-1.39,3.56-.02,7.44.13,11.65.43Z"
        style={{ strokeMiterlimit: 10, strokeWidth: "14px" }}
      />
      <path
        d="m252.41,161.34l.16,32.99c1.47,35.68-15.37,53.92-50.51,54.74l-119.17.58c-35.15-.48-52.16-18.56-51.04-54.25l-.16-32.99,220.72-1.07Zm-191.95,31.82l.02,3.88c.04,9.06,2.07,15.14,6.07,18.24,3.03,2.25,8.42,3.41,16.19,3.48l119.17-.58c8.84-.15,14.81-2.01,17.92-5.58,2.68-3.25,4.05-8.7,4.13-16.35l-.02-3.88-163.48.79Z"
        style={{ strokeMiterlimit: 10, strokeWidth: "14px" }}
      />
    </svg>
  );
}

function LogoMyudak(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 595.28 595.28"
      aria-hidden="true"
      {...props}
    >
      <polygon points="206.43 406.96 297.66 564.99 297.65 565.01 115 565.01 206.32 406.83 206.34 406.8 206.43 406.96" />
      <polygon points="571.62 90.47 480.3 248.65 388.99 406.8 297.75 248.78 297.66 248.63 388.97 90.47 571.62 90.47" />
      <polygon points="297.65 248.65 115 248.65 23.67 90.47 206.32 90.47 297.65 248.65" />
    </svg>
  );
}

function LogoMark() {
  return (
    <span className="landing-logo" aria-hidden="true">
      <LogoSiapDips className="landing-logo-sd" />
      <LogoMyudak className="landing-logo-my" />
    </span>
  );
}

function HeroVideo() {
  return (
    <div className="browser-stage reveal reveal-delay-2">
      <div className="browser-toolbar">
        <span />
        <span />
        <span />
        <p>siap-dips.local/dashboard</p>
      </div>
      <div className="browser-video-wrap">
        <video
          className="hero-video"
          src="/video/vid-jadwal.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Preview fitur jadwal Siap Dips"
        />
        <div className="video-fallback">Preview fitur Siap Dips</div>
      </div>
      <div className="floating-note note-one">
        <BellRing size={16} />
        Tugas Kulon kebaca
      </div>
      <div className="floating-note note-two">
        <ListChecks size={16} />
        Todo lokal tetap rapi
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <article className={`feature-card accent-${feature.accent}`}>
      <div className="feature-video">
        <video
          src={feature.video}
          autoPlay
          muted
          loop
          playsInline
          aria-label={`Video fitur ${feature.title}`}
        />
        <div className="video-fallback">{feature.title}</div>
      </div>
      <div className="feature-copy">
        <Badge className="feature-badge">
          <Icon size={13} />
          {feature.eyebrow}
        </Badge>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    </article>
  );
}

function App() {
  return (
    <main className="landing-page">
      <nav className="landing-nav reveal">
        <a className="brand-lockup" href="#top" aria-label="Siap Dips">
          <LogoMark />
          <span>Siap Dips</span>
        </a>
        <div className="nav-links" aria-label="Navigasi halaman">
          <a href="#fitur">Fitur</a>
          <a href="#workflow">Flow</a>
          <a href="#privasi">Privasi</a>
        </div>
        <Button className="nav-cta" asChild>
          <a href="#mulai">
            Mulai lihat
            <ArrowRight />
          </a>
        </Button>
      </nav>

      <section className="hero-section" id="top">
        <div className="hero-copy reveal reveal-delay-1">
          <Badge className="hero-badge">
            <Sparkles size={14} />
            Campus companion buat mahasiswa Undip
          </Badge>
          <h1>Browser kamu, tapi lebih ngerti ritme kuliah.</h1>
          <p>
            Siap Dips bantu rapihin SIAP, Kulon, Todoist, jadwal, IPK, form
            rutin, dan helper kampus lain dalam satu extension yang nggak sok
            korporat.
          </p>
          <div className="hero-actions">
            <Button size="lg" asChild>
              <a href={storeLinks[0].href} target="_blank" rel="noreferrer">
                <Rocket />
                Install Chrome
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#fitur">
                <Play />
                Lihat promonya
              </a>
            </Button>
          </div>
          <div className="store-strip" aria-label="Link instalasi browser">
            {storeLinks.map((store) => (
              <a
                href={store.href}
                target="_blank"
                rel="noreferrer"
                key={store.name}
              >
                {store.name}
                <ArrowRight size={14} />
              </a>
            ))}
          </div>
          <div className="hero-metrics" aria-label="Ringkasan fitur">
            <span>10+ helper kampus</span>
            <span>Local-first settings</span>
            <span>React + Vite extension</span>
          </div>
        </div>
        <HeroVideo />
      </section>

      <section className="problem-section" aria-labelledby="problem-title">
        <div className="section-kicker reveal">Kenapa ada Siap Dips?</div>
        <div className="problem-grid">
          <div className="problem-heading reveal">
            <h2 id="problem-title">Karena urusan kampus kecil-kecil itu sering makan fokus.</h2>
            <p>
              Siap Dips bukan pengganti portal kampus. Dia layer kecil di atas
              browser yang bantu hal repetitif terasa lebih manusiawi.
            </p>
          </div>
          <div className="pain-list reveal reveal-delay-1">
            {painPoints.map((point) => (
              <div className="pain-item" key={point}>
                <CheckCircle2 size={18} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-section" id="fitur" aria-labelledby="fitur-title">
        <div className="section-heading reveal">
          <Badge className="section-badge">Feature reel</Badge>
          <h2 id="fitur-title">Fitur yang kelihatan kecil, tapi sering nyelametin waktu.</h2>
          <p>
            Video ini pakai footage fitur asli dari project, jadi yang kamu lihat
            memang bagian dari extension-nya.
          </p>
        </div>
        <div className="feature-grid">
          {featureReel.map((feature) => (
            <FeatureCard feature={feature} key={feature.title} />
          ))}
        </div>
      </section>

      <section className="workflow-section" id="workflow" aria-labelledby="workflow-title">
        <div className="section-heading reveal">
          <Badge className="section-badge">Flow harian</Badge>
          <h2 id="workflow-title">Dipakai seperti browser biasa, cuma lebih sat-set.</h2>
        </div>
        <div className="workflow-grid">
          {workflow.map((step, index) => {
            const Icon = step.icon;
            return (
              <article className="workflow-card reveal" key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <Icon />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="trust-section" id="privasi" aria-labelledby="trust-title">
        <div className="trust-panel reveal">
          <div>
            <Badge className="section-badge">
              <ShieldCheck size={13} />
              Privasi dan kontrol
            </Badge>
            <h2 id="trust-title">Data penting tetap kamu yang pegang.</h2>
          </div>
          <p>
            Pengaturan, cache, token opsional, dan konfigurasi helper disimpan
            di storage extension. Integrasi eksternal seperti Todoist atau AI
            hanya jalan ketika kamu sendiri yang mengaktifkan dan mengisi token.
          </p>
          <div className="trust-points">
            <span>Tanpa backend wajib</span>
            <span>Token opsional</span>
            <span>Helper per situs</span>
          </div>
        </div>
      </section>

      <section className="cta-section" id="mulai" aria-labelledby="cta-title">
        <div className="cta-card reveal">
          <Badge className="section-badge">Siap dicoba</Badge>
          <h2 id="cta-title">Bikin browser kuliahmu lebih ngerti kerjaanmu.</h2>
          <p>
            Pilih browser yang kamu pakai, install extension-nya, lalu buka
            portal kampus seperti biasa. Siap Dips tinggal ikut bantu dari sana.
          </p>
          <div className="cta-actions">
            {storeLinks.map((store) => (
              <Button
                size="lg"
                variant={store.name === "Chrome Web Store" ? "default" : "outline"}
                asChild
                key={store.name}
              >
                <a href={store.href} target="_blank" rel="noreferrer">
                  {store.label}
                  <ArrowRight />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span>Siap Dips</span>
        <span>Dibuat buat workflow mahasiswa yang real, bukan cuma rapih di screenshot.</span>
      </footer>
    </main>
  );
}

export default App;
