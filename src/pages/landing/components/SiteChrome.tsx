import { ArrowRight, Github, Moon, Sun } from "lucide-react";
import {
  GITHUB_URL,
  ISSUES_URL,
  PRIVACY_URL,
  chromeStore,
  landingPath,
  storeLinks,
  tutorialPath,
} from "../data/site";
import { featuredTutorials } from "../data/tutorials";



export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src={landingPath("icons/icon128.png")} width={30} height={30} alt="" />
    </span>
  );
}

const navLinks = [
  { href: landingPath("#fitur"), label: "Fitur" },
  { href: landingPath("tutorial/"), label: "Tutorial" },
  { href: landingPath("#faq"), label: "FAQ" },
  { href: landingPath("#changelog"), label: "Changelog" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href={landingPath()} aria-label="Siap Dips, ke beranda">
          <BrandMark />
          <span>Siap Dips</span>
        </a>
        <nav className="header-nav" aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="icon-btn theme-toggle"
            id="theme-toggle"
            aria-label="Ganti tema terang atau gelap"
            title="Ganti tema"
          >
            <Moon className="theme-icon-moon" size={18} aria-hidden="true" />
            <Sun className="theme-icon-sun" size={18} aria-hidden="true" />
          </button>
          <a
            className="btn btn-primary btn-sm"
            href={chromeStore.href}
            target="_blank"
            rel="noopener"
          >
            Install gratis
          </a>
        </div>
      </div>
    </header>
  );
}

export function StoreButtons({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div className={`store-buttons store-buttons-${size}`}>
      {storeLinks.map((store) => (
        <a
          className={`btn ${store.id === "chrome" ? "btn-primary" : "btn-secondary"}`}
          href={store.href}
          target="_blank"
          rel="noopener"
          key={store.id}
        >
          <img src={store.icon} alt="" width="20" height="20" className="store-logo" />
          {store.label}
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="brand" href={landingPath()}>
            <BrandMark />
            <span>Siap Dips</span>
          </a>
          <p>
            Extension gratis buat mahasiswa Undip. Dibuat mahasiswa, tidak
            terafiliasi dengan Universitas Diponegoro.
          </p>
        </div>
        <nav aria-label="Tutorial populer">
          <h2>Tutorial populer</h2>
          <ul>
            {featuredTutorials.map((tutorial) => (
              <li key={tutorial.slug}>
                <a href={tutorialPath(tutorial.slug)}>{tutorial.name}</a>
              </li>
            ))}
            <li>
              <a href={landingPath("tutorial/")}>Semua tutorial</a>
            </li>
          </ul>
        </nav>
        <nav aria-label="Install">
          <h2>Install</h2>
          <ul>
            {storeLinks.map((store) => (
              <li key={store.id}>
                <a href={store.href} target="_blank" rel="noopener">
                  {store.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Proyek">
          <h2>Proyek</h2>
          <ul>
            <li>
              <a href={GITHUB_URL} target="_blank" rel="noopener">
                <Github size={14} aria-hidden="true" /> Kode di GitHub
              </a>
            </li>
            <li>
              <a href={ISSUES_URL} target="_blank" rel="noopener">
                Lapor bug
              </a>
            </li>
            <li>
              <a href={PRIVACY_URL} target="_blank" rel="noopener">
                Kebijakan privasi
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
