import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
      <p className="text-8xl font-light text-[#F0E8D8] mb-6">404</p>
      <h1 className="text-3xl md:text-4xl text-[#1a1a2e] tracking-[0.03em] mb-4">
        Pagina não encontrada
      </h1>
      <p className="text-[14px] text-[#999] font-light mb-10 max-w-md mx-auto">
        A pagina que você está procurando pode ter sido removida ou não existe mais.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="bg-[#1B3A5C] text-white px-10 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#243F6B] transition-colors duration-300"
        >
          Voltar ao inicio
        </Link>
        <Link
          href="/catalogo"
          className="border border-[#1a1a2e] text-[#1a1a2e] px-10 py-3.5 text-[12px] uppercase tracking-[0.15em] font-medium hover:bg-[#1a1a2e] hover:text-white transition-all duration-300"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
