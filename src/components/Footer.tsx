export function Footer() {
  return (
    <footer className="border-t border-amber-900/10 bg-amber-950/5">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <p className="text-center text-sm text-amber-900/60">
          © {new Date().getFullYear()} Music Arts and Cultural Association (MACA). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
