import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSignup, storedSignup, TERMS_VERSION, PRIVACY_VERSION } from '../../src/lib/club/signup-schema.ts';
import { emailHash } from '../../src/lib/club/hash.ts';

const valid = { plan: 'genesis', displayName: ' Pessoa   Teste ', email: ' Pessoa@Example.test ', ageBand: 'adult', interests: ['Pesquisa e escrita', 'Pesquisa e escrita'], termsVersion: TERMS_VERSION, privacyVersion: PRIVACY_VERSION, marketingOptIn: true };

test('cadastro pendente: normaliza e remove o e-mail antes da persistência', () => {
  const result = validateSignup(valid);
  assert.equal(result.ok, true);
  assert.equal(result.value.displayName, 'Pessoa Teste');
  assert.equal(result.value.email, 'pessoa@example.test');
  assert.deepEqual(result.value.interests, ['Pesquisa e escrita']);
  assert.equal(Object.hasOwn(storedSignup(result.value), 'email'), false);
  assert.equal(emailHash(valid.email), emailHash('pessoa@example.test'));
  assert.match(emailHash(valid.email), /^[0-9a-f]{64}$/);
});

test('criança: recusa a presença do campo de e-mail, mesmo vazio ou indefinido', () => {
  for (const email of ['', undefined, null, 'pessoa@example.test']) {
    const result = validateSignup({ ...valid, ageBand: 'child', email });
    assert.equal(result.ok, false);
    assert.equal(result.errors.email, 'not_allowed_for_child');
  }
  const { email, ...withoutEmail } = valid;
  const result = validateSignup({ ...withoutEmail, ageBand: 'child' });
  assert.equal(result.ok, true);
  assert.equal(result.value.marketingOptIn, false);
});

test('recusa versões antigas e dados sensíveis ou comerciais enviados pelo cliente', () => {
  for (const field of ['price', 'amount', 'cpf', 'rg', 'document', 'whatsapp', 'phone']) {
    const result = validateSignup({ ...valid, [field]: 'injected' });
    assert.equal(result.ok, false);
    assert.equal(result.errors[field], 'not_allowed');
  }
  assert.equal(validateSignup({ ...valid, termsVersion: 'old' }).ok, false);
  assert.equal(validateSignup({ ...valid, privacyVersion: 'old' }).ok, false);
});
