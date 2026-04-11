"use client";

import { useLoja } from "@/context/LojaContext";

const fotos = [
  { emoji: "📿", label: "Colar" },
  { emoji: "✨", label: "Brinco" },
  { emoji: "💍", label: "Anel" },
  { emoji: "🎁", label: "Conjunto" },
  { emoji: "⌚", label: "Pulseira" },
  { emoji: "💎", label: "Joia" },
];

export default function InstagramFeed() {
  const { config } = useLoja();

  return (
    <section className="py-16">
      <div className="text-center mb-10 px-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A843] mb-3 font-medium">
          {config.instagram}
        </p>
        <h2 className="text-3xl md:text-4xl text-[#1a1a2e] tracking-[0.03em]">
          Siga-nos no Instagram
        </h2>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
        {fotos.map((foto, i) => (
          <a
            key={i}
            href={`https://instagram.com/${config.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square bg-[#FBF8F3] flex items-center justify-center relative group overflow-hidden"
          >
            <span className="text-4xl opacity-30 group-hover:scale-110 transition-transform duration-500">
              {foto.emoji}
            </span>
            <div className="absolute inset-0 bg-[#1a1a2e]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
