'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface HeaderProps {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.994 2.013 9.338 2 11.965 2h.08zm-.081 1.802h-.078c-2.539 0-2.852.007-3.871.058-.967.044-1.498.196-1.736.26a3.46 3.46 0 00-1.295.996 3.46 3.46 0 00-.996 1.296c-.061.238-.215.77-.26 1.736-.051 1.02-.058 1.332-.058 3.871s.007 2.851.058 3.871c.044.967.196 1.498.26 1.736a3.46 3.46 0 00.996 1.295 3.46 3.46 0 001.296.996c.238.061.77.215 1.736.26 1.02.051 1.332.058 3.871.058s2.851-.007 3.871-.058c.967-.044 1.498-.196 1.736-.26a3.46 3.46 0 001.295-.996 3.46 3.46 0 00.996-1.296c.061-.238.215-.77.26-1.736.051-1.02.058-1.332.058-3.871s-.007-2.851-.058-3.871c-.044-.967-.196-1.498-.26-1.736a3.46 3.46 0 00-.996-1.295 3.46 3.46 0 00-1.296-.996c-.238-.061-.77-.215-1.736-.26-1.02-.051-1.332-.058-3.871-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338.3a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  );
}

function AdminIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L4.05 4.76c-.05.2-.076.408-.076.618v14.124c0 1.5 1.219 2.718 2.724 2.718h10.604c1.505 0 2.724-1.218 2.724-2.718V5.378c0-.21-.026-.418-.076-.618l-5.178-1.943c-.151-.904-.933-1.567-1.85-1.567zM12 8.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM7.5 15a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9z" clipRule="evenodd" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  );
}

export function Header({ facebookUrl, instagramUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const linkClass =
    "flex items-center justify-center w-8 h-8 rounded-full text-amber-900/80 transition hover:text-amber-900 hover:bg-amber-100";
  const disabledClass = "flex items-center justify-center w-8 h-8 rounded-full text-amber-400/60 cursor-default pointer-events-none";

  const navLinkClass = "text-sm font-medium text-amber-900/80 transition hover:text-amber-900 whitespace-nowrap";

  const NavLinks = () => (
    <>
      <Link href="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
        首頁
      </Link>
      <Link href="/activities" className={navLinkClass} onClick={() => setMenuOpen(false)}>
        最新活動
      </Link>
      <Link href="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>
        關於我們
      </Link>
    </>
  );

  const SocialIcons = () => (
    <div className="flex items-center gap-2">
      {facebookUrl ? (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="Facebook"
          aria-label="前往 Facebook"
        >
          <FacebookIcon className="h-5 w-5" />
        </a>
      ) : (
        <span
          className={disabledClass}
          title="Facebook（尚未設定）"
          aria-label="Facebook"
          role="presentation"
        >
          <FacebookIcon className="h-5 w-5" />
        </span>
      )}
      {instagramUrl ? (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title="Instagram"
          aria-label="前往 Instagram"
        >
          <InstagramIcon className="h-5 w-5" />
        </a>
      ) : (
        <span
          className={disabledClass}
          title="Instagram（尚未設定）"
          aria-label="Instagram"
          role="presentation"
        >
          <InstagramIcon className="h-5 w-5" />
        </span>
      )}
      <Link href="/admin" className={linkClass} title="管理員" aria-label="管理員" onClick={() => setMenuOpen(false)}>
        <AdminIcon className="h-5 w-5" />
      </Link>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50 backdrop-blur supports-[backdrop-filter]:bg-amber-50/95">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="MACA 首頁">
          <Image
            src="/logo.svg"
            alt="MACA"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="font-serif text-xl font-semibold tracking-wide text-amber-900">MACA</span>
        </Link>

        {/* Desktop: 橫向導覽 */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          <SocialIcons />
        </div>

        {/* Mobile: 漢堡選單按鈕 */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-amber-900/80 hover:text-amber-900 hover:bg-amber-100 transition"
          aria-label={menuOpen ? '關閉選單' : '開啟選單'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile: 展開的選單 */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-amber-50/98 backdrop-blur border-b border-amber-200/50 shadow-lg">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4">
            <Link href="/" className={navLinkClass + " py-2"} onClick={() => setMenuOpen(false)}>
              首頁
            </Link>
            <Link href="/activities" className={navLinkClass + " py-2"} onClick={() => setMenuOpen(false)}>
              最新活動
            </Link>
            <Link href="/about" className={navLinkClass + " py-2"} onClick={() => setMenuOpen(false)}>
              關於我們
            </Link>
            <div className="flex items-center gap-3 pt-2 border-t border-amber-200/50">
              <SocialIcons />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
