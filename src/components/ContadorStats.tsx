"use client";

import { useState, useEffect, useRef } from "react";
import { useLoja } from "@/context/LojaContext";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const duration = 2000;
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl md:text-5xl text-[#D4A843] tabular-nums">
      {value.toLocaleString("pt-BR")}{suffix}
    </div>
  );
}

const statsDefault = [
  { numero: 1500, sufixo: "+", label: "Clientes satisfeitas" },
  { numero: 350, sufixo: "+", label: "Peças vendidas/mês" },
  { numero: 98, sufixo: "%", label: "Avaliações positivas" },
  { numero: 4, sufixo: ".9", label: "Nota média" },
];

export default function ContadorStats() {
  const { config } = useLoja();
  // Usa stats do config se existir, senão usa default
  const secao = config.secoes?.find(s => s.id === "stats");
  // Stats podem ser customizados via descrição da seção (formato: "1500+|Clientes;350+|Peças/mês;98%|Positivas;4.9|Nota")
  let stats = statsDefault;
  if (secao?.descricao) {
    try {
      const parsed = secao.descricao.split(";").map(s => {
        const [numStr, label] = s.split("|");
        const match = numStr.match(/^(\d+)(.*)/);
        if (match) return { numero: parseInt(match[1]), sufixo: match[2], label: label || "" };
        return null;
      }).filter(Boolean);
      if (parsed.length > 0) stats = parsed as typeof statsDefault;
    } catch {}
  }

  return (
    <section className="bg-[#1a1a2e] py-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <AnimatedNumber target={s.numero} suffix={s.sufixo} />
              <p className="text-[12px] text-white/50 mt-2 uppercase tracking-[0.1em]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
