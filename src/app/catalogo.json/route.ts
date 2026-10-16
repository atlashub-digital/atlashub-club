import { buildCatalog } from "@/lib/catalog";

export const dynamic = "force-static";

/** Catálogo público para o atendimento (Clara/equipa). Sem dados pessoais nem segredos. */
export function GET() {
  return Response.json(buildCatalog(), {
    headers: { "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=300" },
  });
}
