# Security — Club Atlas

Este é um repositório PÚBLICO. Nunca submeter tokens, credenciais, informações de membros, históricos Hermes, dumps de base de dados, chat IDs privados ou ficheiros .env.

Responsável humano por decisões: Sérgio Monteiro. Acesso de Helena a VPS e integrações depende de mandato explícito. Reportar incidentes em canal privado autenticado da AtlasHub (não criar issues públicas com tokens ou dados pessoais).

Escopo: app pública está em preview, sem autenticação/checkout; nenhum bot de comunidade é considerado ativo por este repositório. Antes de produção: Auth, RLS, Turnstile, WAF, isolamento sandbox e backups.

Se uma chave for exposta: revogar imediatamente no fornecedor, auditar acessos, remover de logs, seguir procedimento de incidente e rodar credenciais; retirar do Git não equivale a revogação.
