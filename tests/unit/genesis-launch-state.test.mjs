import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(path, 'utf8');

test('Genesis interest is not presented as an open enrollment or completed matrícula while ARO is draft', () => {
  const customerSurfaces = [
    'src/app/genesis/page.tsx',
    'src/app/page.tsx',
    'src/app/area-membro/page.tsx',
    'src/components/landing/OffersSection.tsx',
    'src/lib/contact.ts',
    'src/lib/offers.ts',
  ].map(read);
  assert.ok(customerSurfaces.every(source => !/inscrições abertas|vagas abertas/i.test(source)));
  assert.equal((read('src/lib/offers.ts').match(/availability: "pending_launch"/g) || []).length, 2);
  assert.match(read('src/lib/offers.ts'), /Registrar interesse não é matrícula/);
  assert.match(read('src/app/genesis/page.tsx'), /checkout ARO ainda não está disponível/i);
});
