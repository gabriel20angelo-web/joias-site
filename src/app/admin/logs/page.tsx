"use client";
import { useLoja } from "@/context/LojaContext";

export default function AdminLogs() {
  const { logs } = useLoja();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1a2e] mb-2">Logs de Atividade</h1>
      <p className="text-[13px] text-[#999] mb-8">Registro de todas as ações realizadas no painel</p>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-[#999] text-[14px]">Nenhuma atividade registrada ainda.</p>
          <p className="text-[#ccc] text-[12px] mt-1">As ações como criar/editar/remover produtos, cupons, etc. aparecerão aqui.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-4 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <div className="w-2 h-2 rounded-full bg-[#D4A843] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#1a1a2e]">
                    <span className="font-medium">{log.acao}</span>
                    {log.detalhes && <span className="text-[#666]"> — {log.detalhes}</span>}
                  </p>
                  <p className="text-[11px] text-[#999] mt-0.5">{new Date(log.data).toLocaleString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
