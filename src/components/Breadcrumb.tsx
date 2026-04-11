"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ itens }: { itens: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-[#999] mb-6 overflow-x-auto whitespace-nowrap py-2">
      <Link href="/" className="hover:text-[#D4A843] transition-colors shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </Link>
      {itens.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 shrink-0">
          <svg className="w-3 h-3 text-[#ddd]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          {item.href ? (
            <Link href={item.href} className="hover:text-[#D4A843] transition-colors">{item.label}</Link>
          ) : (
            <span className="text-[#1a1a2e] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
