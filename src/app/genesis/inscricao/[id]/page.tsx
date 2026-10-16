import type { Metadata } from "next";
import GenesisPayment from "@/components/genesis/GenesisPayment";

export const metadata: Metadata = { title: "Pagamento · Genesis", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="ca-section ca-container ca-narrow" aria-labelledby="pag-title">
      <span className="ca-eyebrow">Genesis · Turma 01</span>
      <h1 id="pag-title" className="ca-page-title">Pagamento da matrícula</h1>
      <GenesisPayment id={id} />
    </section>
  );
}
