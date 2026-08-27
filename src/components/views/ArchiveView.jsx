export default function ArchiveView({ store }) {
  const { archiveEntries } = store;

  if (!archiveEntries.length) {
    return (
      <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card px-6 py-10 text-center text-sm text-[var(--muted)]">
        Δεν έχει διαγραφεί τίποτα ακόμα.
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card overflow-hidden">
      {archiveEntries.map((a) => (
        <div key={a.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-[var(--line)]">
          <div className="shrink-0 text-[11px] font-bold px-[10px] py-1 rounded-full bg-[var(--input-bg)] text-[var(--text)]">
            {a.typeLabel}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14.5px] font-bold text-[var(--text)] break-words">{a.title}</div>
            {a.subtitle && <div className="text-[12.5px] text-[var(--muted)] break-words">{a.subtitle}</div>}
          </div>
          <div className="shrink-0 text-xs text-[var(--muted)] text-right">Διαγράφηκε<br />{a.deletedAtLabel}</div>
        </div>
      ))}
    </div>
  );
}
