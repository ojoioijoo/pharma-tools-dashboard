export default function OverviewCard({ id, dragKey, setDragKey, reorderCards, itemDrop, dropClass = '', padding = 'px-[22px] py-5', children }) {
  const dragging = dragKey === id;

  return (
    <div
      data-card-id={id}
      draggable
      onDragStart={() => setDragKey(id)}
      onDragOver={(e) => { e.preventDefault(); itemDrop?.onDragOver(e); }}
      onDragLeave={itemDrop?.onDragLeave}
      onDrop={(e) => {
        itemDrop?.onDrop(e);
        if (e.isPropagationStopped()) return;
        e.preventDefault();
        reorderCards(dragKey, id);
        setDragKey(null);
      }}
      onDragEnd={() => setDragKey(null)}
      className={`${dropClass} min-w-0 bg-[var(--card-bg)] rounded-[20px] ${padding} shadow-card flex flex-col cursor-grab ${
        dragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
