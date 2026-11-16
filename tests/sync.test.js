import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeCollection } from '../shared/mergeCollection.js';
import { createCollectionHandler } from '../api/_lib/collectionHandler.js';
import { makeToken } from '../api/_lib/auth.js';

test('stale PC additions retain the mobile addition', () => {
  const base = [{ id: 'old', text: 'Old' }];
  const phone = [...base, { id: 'phone', text: 'Phone' }];
  const pc = [...base, { id: 'pc', text: 'PC' }];
  assert.deepEqual(mergeCollection(base, pc, phone), [...phone, pc[1]]);
});

test('edits merge per field and untouched remote changes survive', () => {
  const base = [{ id: 1, text: 'Task', color: 'default' }];
  assert.deepEqual(mergeCollection(base, [{ ...base[0], color: 'red' }], [{ ...base[0], text: 'Edited' }]),
    [{ id: 1, text: 'Edited', color: 'red' }]);
});

test('deletions stay deleted on stale devices and empty collections stay empty', () => {
  const base = [{ id: 1, text: 'Task' }];
  assert.deepEqual(mergeCollection(base, [{ ...base[0], color: 'red' }], []), []);
  assert.deepEqual(mergeCollection(base, [], [...base, { id: 2 }]), [{ id: 2 }]);
  assert.deepEqual(mergeCollection([], [], []), []);
});

test('changes made during an in-flight save survive its response', () => {
  const sent = [{ id: 1, text: 'First' }];
  const local = [{ id: 1, text: 'Second' }, { id: 3 }];
  const response = [...sent, { id: 2 }];
  assert.deepEqual(mergeCollection(sent, local, response), [{ id: 1, text: 'Second' }, { id: 2 }, { id: 3 }]);
});

test('custom note entries merge and order changes retain remote additions', () => {
  const base = [{ id: 'card', items: [{ id: 1, text: 'One' }] }];
  const local = [{ id: 'card', items: [...base[0].items, { id: 2 }] }];
  const remote = [{ id: 'card', items: [...base[0].items, { id: 3 }] }];
  assert.equal(mergeCollection(base, local, remote)[0].items.length, 3);
  assert.deepEqual(mergeCollection(['a', 'b'], ['b', 'a'], ['a', 'b', 'c']), ['b', 'a', 'c']);
});

test('new entries keep their intended position without reordering remote entries', () => {
  assert.deepEqual(mergeCollection([{ id: 1 }], [{ id: 2 }, { id: 1 }], [{ id: 3 }, { id: 1 }]),
    [{ id: 3 }, { id: 2 }, { id: 1 }]);
});

test('API atomically retries concurrent writes and rejects legacy replacement', async () => {
  process.env.DASHBOARD_PASSWORD = 'test-password';
  const originalFetch = globalThis.fetch;
  let raw = JSON.stringify([{ id: 'old' }]);
  let collisions = 0;
  globalThis.fetch = async (_url, options) => {
    const [command, ...args] = JSON.parse(options.body);
    let result;
    if (command === 'GET') result = raw;
    else if (command === 'EVAL') {
      if (raw !== args[3]) { result = 0; collisions++; }
      else { raw = args[4]; result = 1; }
    }
    return { ok: true, json: async () => ({ result }) };
  };
  const handler = createCollectionHandler('test');
  const send = async (body) => {
    const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
    await handler({ method: 'POST', headers: { authorization: `Bearer ${makeToken('test-password')}` }, body }, res);
    return res;
  };
  try {
    const baseItems = [{ id: 'old' }];
    const results = await Promise.all([
      send({ baseItems, items: [...baseItems, { id: 'phone' }] }),
      send({ baseItems, items: [...baseItems, { id: 'pc' }] }),
    ]);
    assert.ok(results.every((res) => res.code === 200));
    assert.ok(collisions > 0);
    assert.deepEqual(JSON.parse(raw).map((x) => x.id).sort(), ['old', 'pc', 'phone']);
    const legacy = await send({ items: [] });
    assert.equal(legacy.code, 409);
    assert.equal(JSON.parse(raw).length, 3);
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ error: 'Redis unavailable' }) });
    assert.equal((await send({ baseItems, items: [] })).code, 500);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.DASHBOARD_PASSWORD;
  }
});
