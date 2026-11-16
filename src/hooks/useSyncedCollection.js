import { useEffect, useRef, useState, useCallback } from 'react';
import { fetchCollection, saveCollection } from '../api.js';
import { mergeCollection } from '../../shared/mergeCollection.js';

const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function useSyncedCollection(name, initial = []) {
  const [items, render] = useState(initial);
  const [status, setStatus] = useState('syncing');
  const state = useRef({ local: initial, base: [], startBase: initial, ready: false, busy: false, restored: false });
  const wake = useRef(() => {});
  const cacheKey = `pharma_tools_pending_${name}`;
  const cache = () => {
    const s = state.current;
    try {
      if (s.ready && equal(s.local, s.base)) localStorage.removeItem(cacheKey);
      else localStorage.setItem(cacheKey, JSON.stringify({ base: s.ready ? s.base : s.startBase, local: s.local }));
    } catch { /* Saving to the server remains available if browser storage is full. */ }
  };
  const setItems = useCallback((update) => {
    const s = state.current;
    s.local = typeof update === 'function' ? update(s.local) : update;
    render(s.local);
    cache();
    queueMicrotask(() => wake.current());
  }, []);

  useEffect(() => {
    let active = true;
    const s = state.current;
    if (!s.restored) {
      s.restored = true;
      try {
        const pending = JSON.parse(localStorage.getItem(cacheKey));
        if (Array.isArray(pending?.base) && Array.isArray(pending?.local)) {
          s.startBase = pending.base;
          s.local = pending.local;
          render(s.local);
        }
      } catch { /* Ignore an invalid local cache. */ }
    }
    const sync = async () => {
      const s = state.current;
      if (s.busy || !active) return;
      s.busy = true;
      try {
        if (!s.ready) {
          const remote = await fetchCollection(name);
          if (!active) return;
          s.local = mergeCollection(s.startBase, s.local, remote);
          s.base = remote;
          s.ready = true;
          render(s.local);
          cache();
        }
        while (active && !equal(s.local, s.base)) {
          setStatus('syncing');
          const sent = s.local;
          const response = await saveCollection(name, sent, s.base);
          if (!active) return;
          s.base = response.items;
          s.local = mergeCollection(sent, s.local, response.items);
          render(s.local);
          cache();
        }
        const remote = await fetchCollection(name);
        if (!active) return;
        s.local = mergeCollection(s.base, s.local, remote);
        s.base = remote;
        render(s.local);
        cache();
        setStatus(equal(s.local, s.base) ? 'synced' : 'syncing');
      } catch {
        if (active) setStatus('error');
      } finally {
        s.busy = false;
      }
    };
    wake.current = sync;
    sync();
    const timer = setInterval(sync, 5000);
    window.addEventListener('focus', sync);
    window.addEventListener('online', sync);
    const visibility = () => { if (!document.hidden) sync(); };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      active = false;
      wake.current = () => {};
      clearInterval(timer);
      window.removeEventListener('focus', sync);
      window.removeEventListener('online', sync);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [name]);

  const dirty = !equal(state.current.local, state.current.base);
  return [items, setItems, dirty ? (status === 'error' ? 'error' : 'syncing') : status, state.current.ready];
}
