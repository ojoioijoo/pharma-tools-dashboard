export default function OverviewCard({ id, dragKey, setDragKey, reorderCards, padding = 'px-[22px] py-5', children }) {
  const dragging = dragKey === id;

  return (
    <div
      draggable
      onDragStart={() => setDragKey(id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        reorderCards(dragKey, id);
        setDragKey(null);
      }}
      onDragEnd={() => setDragKey(null)}
      className={`min-w-0 mb-5 break-inside-avoid bg-[var(--card-bg)] rounded-[20px] ${padding} shadow-card flex flex-col cursor-grab ${
        dragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
