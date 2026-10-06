import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  History,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import { changelogEntries } from "../../constants/changelog";
import {
  AutoplayVideo,
  ScreenImage,
  TutorialCard,
} from "./components/Cards";
import {
  SiteFooter,
  SiteHeader,
  StoreButtons,
} from "./components/SiteChrome";
import { faqItems } from "./data/faq";
import { directoryFeatures, directoryFilters } from "./data/features";
import {
  chromeStore,
  landingPath,
  screens,
  storeLinks,
  tutorialPath,
} from "./data/site";
import {
  featuredTutorials,
  getTutorial,
  tutorials,
} from "./data/tutorials";

const reelSlugs = [
  "jadwal",
  "tema-dark-mode",
  "auto-pbm",
  "ipk",
  "klik-kanan",
  "foodtruk",
];

const reel = reelSlugs
  .map((slug) => getTutorial(slug))
  .filter((tutorial) => tutorial?.video)
  .map((tutorial) => tutorial!);

const flow = [
  {
    title: "Install sekali",
    description:
      "Pilih toko sesuai browser kamu, install, lalu pin ikonnya di toolbar.",
    icon: Rocket,
    href: tutorialPath("install"),
    cta: "Panduan install",
  },
  {
    title: "Atur yang kamu butuh",
    description:
      "Urutkan kartu popup, sembunyikan yang nggak kepake, isi token kalau mau pakai Todoist atau AI.",
    icon: WandSparkles,
    href: tutorialPath("atur-popup"),
    cta: "Atur kartu popup",
  },
  {
    title: "Buka portal seperti biasa",
    description:
      "Helper muncul sendiri di SIAP, SSO, dan Kulon. Nggak ada aplikasi baru yang harus dibuka.",
    icon: CheckCircle2,
    href: landingPath("tutorial/"),
    cta: "Lihat semua tutorial",
  },
];

const latestChangelog = changelogEntries.slice(0, 3);
const olderChangelog = changelogEntries.slice(3);

function ChangelogEntryView({ entry }: { entry: (typeof changelogEntries)[number] }) {
  return (
    <li className="changelog-entry">
      <div className="changelog-head">
        <strong>{entry.version}</strong>
        <span className={`tag tag-${entry.type}`}>{entry.type}</span>
        <span className="muted">{entry.date}</span>
      </div>
      <ul>
        {entry.changes.map((change) => (
          <li key={change}>{change}</li>
        ))}
      </ul>
    </li>
  );
}

function App() {
  return (
    <>
      <SiteHeader />
      <main id="konten">
        <section className="hero container" aria-labelledby="hero-title">
          <a className="pill" href={tutorialPath("moodle-helper")}>
            <b>Tips</b>
            Panggil Tany AI di quiz Kulon pakai Alt+A
            <ArrowRight size={14} aria-hidden="true" />
          </a>
          <h1 id="hero-title">Browser kamu, tapi lebih ngerti ritme kuliah.</h1>
          <p className="lead">
            Siap Dips adalah extension gratis buat mahasiswa Undip. Jadwal,
            IPK, Kulon, PBM, sampai absen QR dirapihin langsung dari browser,
            lengkap dengan tutorial langkah demi langkah.
          </p>
          <div className="actions">
            <a className="btn btn-primary btn-lg" href={chromeStore.href} target="_blank" rel="noopener">
              <img src={chromeStore.icon} alt="" width="20" height="20" className="store-logo" />
              Install di Chrome
            </a>
            <a className="btn btn-secondary btn-lg" href={landingPath("tutorial/")}>
              <BookOpen size={18} aria-hidden="true" />
              Lihat tutorial
            </a>
          </div>
          <p className="store-note">
            Juga ada di{" "}
            {storeLinks.slice(1).map((store, index) => (
              <span key={store.id}>
                {index > 0 && " dan "}
                <a href={store.href} target="_blank" rel="noopener">
                  {store.name}
                </a>
              </span>
            ))}
            . Gratis, tanpa akun.
          </p>
          <div className="hero-shot">
            <ScreenImage screen={screens.popupDashboard} priority caption={false} />
          </div>
          <dl className="stats">
            <div>
              <dt>Kartu di popup</dt>
              <dd>19</dd>
            </div>
            <div>
              <dt>Tutorial lengkap</dt>
              <dd>{tutorials.length}</dd>
            </div>
            <div>
              <dt>Browser</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>Server Siap Dips</dt>
              <dd>0</dd>
            </div>
          </dl>
        </section>

        <section className="section container" id="fitur" aria-labelledby="fitur-title">
          <div className="section-head">
            <span className="kicker">Fitur</span>
            <h2 id="fitur-title">Fitur kecil yang sering nyelametin waktu.</h2>
            <p>
              Semua video di bawah direkam dari extension aslinya. Klik kartunya
              buat tutorial lengkap.
            </p>
          </div>
          <div className="reel-grid">
            {reel.map((tutorial) => {
              const Icon = tutorial.icon;
              return (
                <a className="card reel-card" href={tutorialPath(tutorial.slug)} key={tutorial.slug}>
                  <div className="reel-media">
                    <AutoplayVideo video={tutorial.video!} />
                  </div>
                  <div className="reel-copy">
                    <span className="card-icon">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <h3>{tutorial.name}</h3>
                    <p>{tutorial.description}</p>
                    <span className="text-link">
                      Baca tutorial <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section className="section container" id="semua-fitur" aria-labelledby="direktori-title">
          <div className="section-head">
            <span className="kicker">Semua fitur</span>
            <h2 id="direktori-title">Satu extension, banyak helper.</h2>
            <p>
              Pilih kategori buat menyaring. Fitur yang punya tutorial bisa
              diklik.
            </p>
          </div>
          <div className="filters" role="group" aria-label="Saring fitur per kategori" data-filter-group>
            <button type="button" className="chip" data-filter="all" aria-pressed="true">
              Semua <span className="chip-count">{directoryFeatures.length}</span>
            </button>
            {directoryFilters.map((filter) => (
              <button type="button" className="chip" data-filter={filter.id} aria-pressed="false" key={filter.id}>
                {filter.label}{" "}
                <span className="chip-count">
                  {directoryFeatures.filter((f) => f.category === filter.id).length}
                </span>
              </button>
            ))}
          </div>
          <ul className="directory" data-filter-list>
            {directoryFeatures.map((feature) => {
              const Icon = feature.icon;
              const body = (
                <>
                  <span className="card-icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="directory-text">
                    <strong>{feature.name}</strong>
                    <span>{feature.description}</span>
                    <small>{feature.where}</small>
                  </span>
                </>
              );
              return (
                <li key={feature.name} data-category={feature.category}>
                  {feature.tutorial ? (
                    <a className="directory-item is-link" href={tutorialPath(feature.tutorial)}>
                      {body}
                      <ArrowRight className="card-arrow" size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <div className="directory-item">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="section container" id="tutorial" aria-labelledby="tutorial-title">
          <div className="section-head section-head-row">
            <div>
              <span className="kicker">Tutorial</span>
              <h2 id="tutorial-title">Baru install? Mulai dari sini.</h2>
              <p>
                Tiap tutorial berisi langkah yang sama persis dengan tombol di
                extension, plus video atau screenshot.
              </p>
            </div>
            <a className="btn btn-secondary" href={landingPath("tutorial/")}>
              Semua {tutorials.length} tutorial <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="tutorial-grid">
            {featuredTutorials.map((tutorial) => (
              <TutorialCard tutorial={tutorial} key={tutorial.slug} />
            ))}
          </div>
        </section>

        <section className="section container" id="cara-kerja" aria-labelledby="flow-title">
          <div className="section-head">
            <span className="kicker">Cara kerja</span>
            <h2 id="flow-title">Dipakai seperti browser biasa, cuma lebih sat-set.</h2>
          </div>
          <ol className="flow">
            {flow.map((step) => {
              const Icon = step.icon;
              return (
                <li className="card flow-step" key={step.title}>
                  <span className="card-icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <a className="text-link" href={step.href}>
                    {step.cta} <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="section container" id="privasi" aria-labelledby="privasi-title">
          <div className="privacy">
            <div>
              <span className="kicker">
                <ShieldCheck size={14} aria-hidden="true" /> Privasi
              </span>
              <h2 id="privasi-title">Data penting tetap kamu yang pegang.</h2>
              <p>
                Pengaturan, jadwal, cache tugas, dan token opsional disimpan di
                storage extension di browser kamu. Siap Dips nggak punya server
                yang menerima data kamu, dan nggak ada iklan atau analytics.
              </p>
            </div>
            <ul className="privacy-points">
              <li>
                <LockKeyhole size={18} aria-hidden="true" />
                <span>
                  <strong>Tanpa akun</strong>
                  Nggak perlu daftar atau login ke Siap Dips.
                </span>
              </li>
              <li>
                <LockKeyhole size={18} aria-hidden="true" />
                <span>
                  <strong>Token opsional</strong>
                  Todoist dan AI jalan cuma kalau kamu isi token sendiri.
                </span>
              </li>
              <li>
                <LockKeyhole size={18} aria-hidden="true" />
                <span>
                  <strong>Kode terbuka</strong>
                  Bisa dicek siapa saja di GitHub.
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className="section container narrow" id="faq" aria-labelledby="faq-title">
          <div className="section-head">
            <span className="kicker">FAQ</span>
            <h2 id="faq-title">Pertanyaan yang sering muncul.</h2>
          </div>
          <div className="faq">
            {faqItems.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section container narrow" id="changelog" aria-labelledby="changelog-title">
          <div className="section-head">
            <span className="kicker">
              <History size={14} aria-hidden="true" /> Changelog
            </span>
            <h2 id="changelog-title">Yang baru di Siap Dips.</h2>
          </div>
          <ol className="changelog">
            {latestChangelog.map((entry) => (
              <ChangelogEntryView entry={entry} key={entry.version} />
            ))}
          </ol>
          {olderChangelog.length > 0 && (
            <details className="changelog-more">
              <summary>Lihat {olderChangelog.length} versi sebelumnya</summary>
              <ol className="changelog">
                {olderChangelog.map((entry) => (
                  <ChangelogEntryView entry={entry} key={entry.version} />
                ))}
              </ol>
            </details>
          )}
        </section>

        <section className="section container" id="install" aria-labelledby="cta-title">
          <div className="cta">
            <h2 id="cta-title">Bikin browser kuliahmu lebih ngerti kerjaanmu.</h2>
            <p>
              Pilih browser yang kamu pakai, install, lalu buka portal kampus
              seperti biasa.
            </p>
            <StoreButtons size="lg" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
