import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(path, 'utf8');
test('public Free routes preserve credits, local exercise and honest community status', () => {
  const radar = read('src/app/radar/page.tsx');
  for (const text of ['Radar Atlas — ideias que vale explorar', 'F8NKVhkZZWI', 'Eaf1UxvGmlE', 'IBM Technology', 'Eli Rigobeli - IA', 'youtube-nocookie.com/embed/', 'Assistir no YouTube']) assert.ok(radar.includes(text), text);
  const course = read('src/app/comecar/page.tsx');
  for (const text of ['Chatbot, automação e agente', 'Dê uma missão clara à IA', 'Confira o resultado antes de confiar', 'MissionBuilder', 'Perguntas de reflexão']) assert.ok(course.includes(text), text);
  assert.equal((course.match(/<legend>/g) || []).length, 4);
  const exercise = read('src/components/free/MissionBuilder.tsx');
  for (const text of ['objective', 'source', 'action', 'stop', 'evidence', 'clipboard.writeText', '.select()', 'Limpar', 'aria-live']) assert.ok(exercise.includes(text), text);
  assert.doesNotMatch(exercise, /fetch\(|localStorage|sessionStorage|sendBeacon|console\.|\/api\//);
  const community = read('src/app/comunidade/page.tsx');
  assert.match(community, /espaços de postagem e a moderação ainda não estão ativos/);
  assert.doesNotMatch(community, /clubWhatsAppUrl|discord\.gg/);
  for (const path of ['radar', 'comecar', 'comunidade']) assert.match(read(`src/app/${path}/page.tsx`), /robots: \{ index: false, follow: false \}/);
  for (const route of ['/radar', '/comecar']) assert.ok(read('src/app/page.tsx').includes(`href="${route}"`));
});

test('mission exercise assembles all answers, copies, falls back and clears locally', async () => {
  const { default: ts } = await import('typescript');
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const states = [];
  let cursor = 0;
  const refs = [];
  let refCursor = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in states)) states[index] = initial;
      return [states[index], value => { states[index] = value; }];
    },
    useRef() {
      const index = refCursor++;
      return refs[index] ||= { current: { focus() { this.focused = true; }, select() { this.selected = true; } } };
    },
  };
  let copied;
  const navigator = { clipboard: { async writeText(value) { copied = value; } } };
  const compiled = ts.transpileModule(read('src/components/free/MissionBuilder.tsx'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  new Function('require', 'exports', 'navigator', compiled)(
    name => name === 'react' ? react : require(name), exports, navigator,
  );
  const render = () => { cursor = 0; refCursor = 0; return exports.default(); };
  function nodes(node) {
    if (!node || typeof node !== 'object') return [];
    return [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)];
  }
  let tree = nodes(render());
  assert.equal(tree.find(node => node.type === 'button').props.disabled, true);
  const answers = ['Preparar três opções', 'Tabela fictícia de estudo', 'Preparar sem enviar', 'Parar se faltar informação', 'Conferir os três itens na tabela'];
  for (const [index, field] of tree.filter(node => node.type === 'textarea' && !node.props.readOnly).entries()) {
    const current = nodes(render()).find(node => node.props?.id === field.props.id);
    current.props.onChange({ target: { value: answers[index] } });
  }
  tree = nodes(render());
  assert.equal(tree.find(node => node.type === 'button').props.disabled, false);
  const output = tree.find(node => node.props?.id === 'mission-output').props.value;
  for (const answer of answers) assert.ok(output.includes(answer));
  await tree.find(node => node.type === 'button').props.onClick();
  assert.equal(copied, output);
  navigator.clipboard.writeText = async () => { throw new Error('unavailable'); };
  await nodes(render()).find(node => node.type === 'button').props.onClick();
  assert.equal(refs[0].current.selected, true);
  assert.ok(nodes(render()).some(node => node.props?.children?.includes?.('Cópia automática indisponível')));
  nodes(render()).filter(node => node.type === 'button')[1].props.onClick();
  tree = nodes(render());
  assert.equal(tree.find(node => node.type === 'button').props.disabled, true);
  for (const field of tree.filter(node => node.type === 'textarea' && !node.props.readOnly)) assert.equal(field.props.value, '');
  assert.equal(refs[1].current.focused, true);
});
