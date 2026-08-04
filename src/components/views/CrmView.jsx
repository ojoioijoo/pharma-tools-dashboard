export default function CrmView({ store }) {
  const { crmQuery, setCrmQuery, filteredCustomers } = store;

  return (
    <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card overflow-hidden">
      <div className="px-6 py-[18px] border-b border-[var(--line)]">
        <input
          type="text"
          placeholder="Αναζήτηση πελάτη..."
          value={crmQuery}
          onChange={(e) => setCrmQuery(e.target.value)}
          className="w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-xl px-4 py-[11px] text-sm font-sans outline-none"
        />
      </div>
      {filteredCustomers.map((c) => (
        <div key={c.id} className="flex gap-4 px-6 py-[18px] border-b border-[var(--line)] items-start">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-[var(--text)]"
            style={{ background: c.color }}
          >
            {c.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="text-[15px] font-bold text-[var(--text)]">{c.name}</div>
              <div className="text-xs text-[var(--muted)]">Τελ. επίσκεψη: {c.lastVisit}</div>
            </div>
            <div className="flex gap-2 flex-wrap mb-2">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11.5px] font-semibold px-[11px] py-1 rounded-full bg-[var(--input-bg)] text-[var(--text)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-[13.5px] text-[var(--text)] leading-relaxed">{c.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
