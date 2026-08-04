export default function TefteriView({ store }) {
  const { tefteriEntries, tefteriTotal, toggleTefteri } = store;

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm text-[var(--muted)]">Σύνολο χρωστούμενων</div>
        <div className="font-heading font-bold text-2xl text-[var(--text)]">{tefteriTotal}</div>
      </div>
      <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card overflow-hidden">
        {tefteriEntries.map((e) => (
          <div key={e.id} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--line)]">
            <div
              onClick={() => toggleTefteri(e.id)}
              className={`w-[22px] h-[22px] rounded-[7px] shrink-0 cursor-pointer border-2 border-primary ${
                e.paid ? 'bg-primary' : 'bg-transparent'
              }`}
            />
            <div className={`flex-1 min-w-0 ${e.paid ? 'line-through' : ''}`}>
              <div className="text-[14.5px] font-bold text-[var(--text)]">{e.customer}</div>
              <div className="text-[12.5px] text-[var(--muted)]">{e.note}</div>
            </div>
            <div className="text-xs text-[var(--muted)] w-[60px] text-right">{e.date}</div>
            <div className="text-[15px] font-bold w-20 text-right text-[var(--text)]">{e.amountLabel}</div>
          </div>
        ))}
      </div>
    </>
  );
}
