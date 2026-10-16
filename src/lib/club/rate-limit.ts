/**
 * Rate limit de janela deslizante, em memória.
 * Suficiente para dry-run/preview. Em produção (serverless, várias instâncias) tem de ser
 * substituído por armazenamento partilhado — proposta: função SQL `club.hit_rate_limit`
 * (docs/sql/drafts/002_club_auth_onboarding.sql) ou serviço gerido aprovado pela Helena.
 */
export type RateLimiter = { hit(key: string, now?: number): { allowed: boolean; retryAfterS: number } };

export function createMemoryRateLimiter(limit: number, windowMs: number): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, retryAfterS: Math.ceil((windowMs - (now - recent[0])) / 1000) };
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 10_000) hits.delete(hits.keys().next().value as string);
      return { allowed: true, retryAfterS: 0 };
    },
  };
}
