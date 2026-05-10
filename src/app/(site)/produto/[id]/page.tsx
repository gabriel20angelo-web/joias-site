import ProdutoClient from "./ProdutoClient";

export async function generateStaticParams() {
  return [{ id: "_" }];
}

export default function Page() {
  return <ProdutoClient />;
}
