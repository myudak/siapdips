import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  Globe,
  Lightbulb,
  ListOrdered,
} from "lucide-react";
import { ScreenImage, TutorialCard, TutorialVideo } from "./components/Cards";
import { Inline } from "./components/Inline";
import { SiteFooter, SiteHeader, StoreButtons } from "./components/SiteChrome";
import { landingPath, tutorialPath } from "./data/site";
import {
  getTutorial,
  tutorialCategories,
  tutorials,
  tutorialsByCategory,
  type Tutorial,
} from "./data/tutorials";

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.label}>
            {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 && <ChevronRight size={14} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function TutorialHub() {
  return (
    <>
      <SiteHeader />
      <main id="konten" className="container page">
        <Breadcrumbs items={[{ label: "Beranda", href: landingPath() }, { label: "Tutorial" }]} />
        <header className="page-head">
          <span className="kicker">Tutorial</span>
          <h1>Tutorial Siap Dips buat mahasiswa Undip</h1>
          <p className="lead">
            {tutorials.length} panduan langkah demi langkah, dari install sampai
            Auto PBM, dark mode SIAP, Todoist, dan Moodle helper di Kulon. Tiap
            langkah pakai nama tombol yang sama dengan di extension.
          </p>
        </header>
        <nav className="hub-jump" aria-label="Kategori tutorial">
          {tutorialsByCategory.map((group) => (
            <a className="chip" href={`#${group.category}`} key={group.category}>
              {group.label} <span className="chip-count">{group.items.length}</span>
            </a>
          ))}
        </nav>
        {tutorialsByCategory.map((group) => (
          <section className="hub-group" id={group.category} aria-labelledby={`${group.category}-title`} key={group.category}>
            <div className="hub-group-head">
              <h2 id={`${group.category}-title`}>{group.label}</h2>
              <p>{group.description}</p>
            </div>
            <div className="tutorial-grid">
              {group.items.map((tutorial) => (
                <TutorialCard tutorial={tutorial} key={tutorial.slug} />
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}

export function TutorialPage({ tutorial }: { tutorial: Tutorial }) {
  const index = tutorials.findIndex((t) => t.slug === tutorial.slug);
  const prev = index > 0 ? tutorials[index - 1] : undefined;
  const next = index < tutorials.length - 1 ? tutorials[index + 1] : undefined;
  const related = tutorial.related
    .map((slug) => getTutorial(slug))
    .filter((t): t is Tutorial => Boolean(t));
  const category = tutorialCategories[tutorial.category];
  const Icon = tutorial.icon;

  return (
    <>
      <SiteHeader />
      <main id="konten" className="container page">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: landingPath() },
            { label: "Tutorial", href: landingPath("tutorial/") },
            { label: tutorial.name },
          ]}
        />
        <article className="tutorial">
          <header className="page-head">
            <span className="kicker">
              <Icon size={14} aria-hidden="true" /> {category.label}
            </span>
            <h1>{tutorial.title}</h1>
            <p className="lead">{tutorial.intro}</p>
            <ul className="meta-row" aria-label="Ringkasan tutorial">
              <li>
                <Clock size={14} aria-hidden="true" /> {tutorial.minutes} menit
              </li>
              <li>
                <ListOrdered size={14} aria-hidden="true" /> {tutorial.steps.length} langkah
              </li>
              <li>
                <Globe size={14} aria-hidden="true" /> {tutorial.sites.join(" · ")}
              </li>
            </ul>
          </header>

          {tutorial.video ? (
            <TutorialVideo video={tutorial.video} />
          ) : tutorial.screen ? (
            <ScreenImage screen={tutorial.screen} priority />
          ) : null}

          <div className="tutorial-body">
            <section aria-labelledby="langkah-title">
              <h2 id="langkah-title">Langkah-langkah</h2>
              <ol className="steps">
                {tutorial.steps.map((step, stepIndex) => (
                  <li id={`langkah-${stepIndex + 1}`} key={step.title}>
                    <h3>{step.title}</h3>
                    <p>
                      <Inline text={step.body} />
                    </p>
                  </li>
                ))}
              </ol>

              {tutorial.tips && tutorial.tips.length > 0 && (
                <aside className="tips" aria-labelledby="tips-title">
                  <h2 id="tips-title">
                    <Lightbulb size={18} aria-hidden="true" /> Tips
                  </h2>
                  <ul>
                    {tutorial.tips.map((tip) => (
                      <li key={tip}>
                        <Inline text={tip} />
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              {tutorial.video && tutorial.screen && (
                <ScreenImage screen={tutorial.screen} />
              )}
              {tutorial.extraVideo && <TutorialVideo video={tutorial.extraVideo} />}
            </section>

            <aside className="tutorial-aside" aria-label="Info tambahan">
              <div className="card aside-card">
                <h2>Daftar langkah</h2>
                <ol className="toc">
                  {tutorial.steps.map((step, stepIndex) => (
                    <li key={step.title}>
                      <a href={`#langkah-${stepIndex + 1}`}>{step.title}</a>
                    </li>
                  ))}
                </ol>
              </div>
              {tutorial.slug !== "install" && (
                <div className="card aside-card">
                  <h2>Belum install?</h2>
                  <p>Siap Dips gratis buat Chrome, Firefox, dan Edge.</p>
                  <a className="text-link" href={tutorialPath("install")}>
                    Cara install <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              )}
            </aside>
          </div>
        </article>

        {tutorial.slug === "install" && (
          <section className="section" aria-labelledby="toko-title">
            <h2 id="toko-title">Link install resmi</h2>
            <StoreButtons />
          </section>
        )}

        <nav className="pager" aria-label="Tutorial sebelum dan sesudahnya">
          {prev ? (
            <a className="card pager-link" href={tutorialPath(prev.slug)} rel="prev">
              <span className="muted">
                <ArrowLeft size={14} aria-hidden="true" /> Sebelumnya
              </span>
              <strong>{prev.name}</strong>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a className="card pager-link pager-next" href={tutorialPath(next.slug)} rel="next">
              <span className="muted">
                Selanjutnya <ArrowRight size={14} aria-hidden="true" />
              </span>
              <strong>{next.name}</strong>
            </a>
          )}
        </nav>

        {related.length > 0 && (
          <section className="section" aria-labelledby="terkait-title">
            <h2 id="terkait-title" className="section-title-sm">Tutorial terkait</h2>
            <div className="tutorial-grid">
              {related.map((item) => (
                <TutorialCard tutorial={item} key={item.slug} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main id="konten" className="container page narrow not-found">
        <span className="kicker">404</span>
        <h1>Halaman ini nggak ketemu.</h1>
        <p className="lead">
          Mungkin link-nya sudah berubah. Coba cari dari daftar tutorial atau
          balik ke beranda.
        </p>
        <div className="actions">
          <a className="btn btn-primary" href={landingPath("tutorial/")}>
            Lihat semua tutorial
          </a>
          <a className="btn btn-secondary" href={landingPath()}>
            Ke beranda
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
