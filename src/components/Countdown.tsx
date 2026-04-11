"use client";

import { useState, useEffect } from "react";

export default function Countdown({ label }: { label?: string }) {
  const [tempo, setTempo] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    // Countdown resets every day at midnight
    function calcular() {
      const agora = new Date();
      const fimDoDia = new Date(agora);
      fimDoDia.setHours(23, 59, 59, 999);
      const diff = fimDoDia.getTime() - agora.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTempo({ h, m, s });
    }
    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-[11px] uppercase tracking-[0.1em] text-[#c44] font-medium">{label}</span>}
      <div className="flex items-center gap-1">
        {[
          { valor: pad(tempo.h), label: "h" },
          { valor: pad(tempo.m), label: "m" },
          { valor: pad(tempo.s), label: "s" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-[#c44] text-[15px]">:</span>}
            <span className="bg-[#1a1a2e] text-white text-[13px] font-medium px-1.5 py-0.5 min-w-[28px] text-center tabular-nums">
              {item.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
