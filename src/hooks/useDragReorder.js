import { useState } from 'react';

// Drag-to-reorder για στοιχεία λίστας (τύπου Trello): σέρνεις ένα στοιχείο πάνω
// σε άλλο και παίρνει τη θέση του. Το στοιχείο πάνω από το οποίο περνάει το
// ποντίκι παίρνει ένα πλαίσιο-highlight (βλ. rowClass) σαν drop-target.
export function useDragReorder(reorder) {
  const [draggingId, setDraggingId] = useState(null);
  const [overId, setOverId] = useState(null);

  const dragHandlers = (id) => ({
    draggable: true,
    onDragStart: (e) => {
      e.stopPropagation();
      setDraggingId(id);
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (id !== draggingId) setOverId(id);
    },
    onDragLeave: () => setOverId((cur) => (cur === id ? null : cur)),
    onDrop: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (draggingId && draggingId !== id) reorder(draggingId, id);
      setDraggingId(null);
      setOverId(null);
    },
    onDragEnd: (e) => {
      e.stopPropagation();
      setDraggingId(null);
      setOverId(null);
    },
  });

  const rowClass = (id) =>
    [
      'cursor-pointer',
      draggingId === id ? 'opacity-40' : '',
      overId === id && draggingId !== id ? 'ring-2 ring-primary ring-inset rounded-lg' : '',
    ]
      .filter(Boolean)
      .join(' ');

  return { dragHandlers, rowClass };
}
