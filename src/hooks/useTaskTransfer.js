import { useState } from 'react';

export function useTaskTransfer({ tasks, setTasks, todos, setTodos, customCards, setCustomCards, selectedDate, today }) {
  const [source, setSource] = useState(null);
  const [over, setOver] = useState(null);
  const list = (card) => card === 'tasks' ? tasks : card === 'todos' ? todos : customCards.find((c) => c.id === card)?.items;
  const move = (card, before, date = selectedDate) => {
    const item = list(source.card)?.find((it) => it.id === source.id);
    if (!item || !list(card) || (source.card === card && before === item.id)) return;
    const text = source.card === 'todos' ? item.drug : item.text;
    const done = source.card === 'todos' ? item.status === 'done' : !!item.done;
    let moved = { ...item };
    if (card === 'tasks') moved = { ...moved, text, done, dateISO: date };
    else if (card === 'todos') moved = { ...moved, drug: text, patient: item.patient || '', qty: item.qty || '', status: done ? 'done' : 'pending', dateISO: item.dateISO || today };
    else moved = { ...moved, text, done, createdAt: item.createdAt || Date.now() };
    const update = (items, key) => {
      if (key !== card && key !== source.card) return items;
      const next = items.filter((it) => it.id !== item.id);
      if (key === card) {
        const index = next.findIndex((it) => it.id === before);
        next.splice(index < 0 ? next.length : index, 0, moved);
      }
      return next;
    };
    if (card === 'tasks' || source.card === 'tasks') setTasks((prev) => update(prev, 'tasks'));
    if (card === 'todos' || source.card === 'todos') setTodos((prev) => update(prev, 'todos'));
    if (customCards.some((c) => c.id === card || c.id === source.card)) setCustomCards((prev) => prev.map((c) => ({ ...c, items: update(c.items, c.id) })));
  };
  const clear = () => { setSource(null); setOver(null); };
  const itemDrag = (card, id) => ({
    draggable: true,
    onDragStart: (e) => {
      if (e.target.closest('input, textarea, button')) { e.preventDefault(); return; }
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/x-pharmacy-task', JSON.stringify({ card, id }));
      setSource({ card, id });
    },
    onDragEnd: (e) => { e.stopPropagation(); clear(); },
  });
  const itemDrop = (card, before, date) => ({
    onDragOver: (e) => {
      if (!source) return;
      e.preventDefault(); e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      setOver(`${card}:${before || date || ''}`);
    },
    onDragLeave: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(null); },
    onDrop: (e) => {
      if (!source) return;
      e.preventDefault(); e.stopPropagation();
      move(card, before, date); clear();
    },
  });
  const itemDragClass = (card, id, date) => `${source?.card === card && source.id === id ? 'opacity-40' : ''} ${over === `${card}:${id || date || ''}` ? 'ring-2 ring-primary ring-inset rounded-lg' : ''}`;
  return { itemDrag, itemDrop, itemDragClass };
}
