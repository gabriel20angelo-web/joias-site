"use client";

export default function Estrelas({ nota, total }: { nota: number; total?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = nota >= i ? 100 : nota >= i - 0.5 ? 50 : 0;
          return (
            <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20">
              <defs>
                <linearGradient id={`star-${i}-${nota}`}>
                  <stop offset={`${fill}%`} stopColor="#D4A843" />
                  <stop offset={`${fill}%`} stopColor="#d4d4d4" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#star-${i}-${nota})`}
                d="M10 1l2.39 4.84L17.82 6.8l-3.91 3.81.92 5.39L10 13.47 5.17 16l.92-5.39L2.18 6.8l5.43-.96L10 1z"
              />
            </svg>
          );
        })}
      </div>
      {nota > 0 && (
        <span className="text-[11px] text-[#999] font-light">
          {nota.toFixed(1)}
          {total !== undefined && ` (${total})`}
        </span>
      )}
    </div>
  );
}
