export default function FinanceView({ store }) {
  const { financeSummary, salesWeek, financeMonths, transactions } = store;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-5 sm:mb-[22px]">
        <div className="min-w-0 bg-[var(--card-bg)] rounded-[20px] px-4 sm:px-[22px] py-4 sm:py-5 shadow-card">
          <div className="text-[13px] text-[var(--muted)] mb-2">Ταμείο τώρα</div>
          <div className="font-heading text-[18px] sm:text-[22px] font-bold text-[var(--text)] truncate">{financeSummary.cashNow}</div>
        </div>
        <div className="min-w-0 bg-[var(--card-bg)] rounded-[20px] px-4 sm:px-[22px] py-4 sm:py-5 shadow-card">
          <div className="text-[13px] text-[var(--muted)] mb-2">Έσοδα μήνα</div>
          <div className="font-heading text-[18px] sm:text-[22px] font-bold text-primary-hover truncate">{financeSummary.monthIncome}</div>
        </div>
        <div className="min-w-0 bg-[var(--card-bg)] rounded-[20px] px-4 sm:px-[22px] py-4 sm:py-5 shadow-card">
          <div className="text-[13px] text-[var(--muted)] mb-2">Έξοδα μήνα</div>
          <div className="font-heading text-[18px] sm:text-[22px] font-bold text-danger truncate">{financeSummary.monthExpense}</div>
        </div>
        <div className="min-w-0 bg-[var(--card-bg)] rounded-[20px] px-4 sm:px-[22px] py-4 sm:py-5 shadow-card">
          <div className="text-[13px] text-[var(--muted)] mb-2">Καθαρό κέρδος</div>
          <div className="font-heading text-[18px] sm:text-[22px] font-bold text-[var(--text)] truncate">{financeSummary.netProfit}</div>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-[20px] p-4 sm:p-6 shadow-card mb-5">
        <div className="font-heading font-bold text-base mb-1.5 text-[var(--text)]">Ημερήσιες πωλήσεις (εβδομάδα)</div>
        <div className="flex gap-4 text-[12.5px] text-[var(--muted)] mb-4">
          <span>● Πωλήσεις</span>
        </div>
        <div className="flex gap-2 sm:gap-4 h-[150px]">
          {salesWeek.map((d) => (
            <div key={d.day} className="flex flex-col justify-end items-center gap-2 flex-1 min-w-0">
              <div className="w-full max-w-[38px] rounded-t-[9px] rounded-b-[4px] bg-primary" style={{ height: `${d.pct}%` }} />
              <div className="text-xs text-[var(--muted)]">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-[20px] p-4 sm:p-6 shadow-card mb-5">
        <div className="font-heading font-bold text-base mb-1.5 text-[var(--text)]">Μηνιαία τάση εσόδων / εξόδων</div>
        <div className="flex gap-4 text-[12.5px] text-[var(--muted)] mb-4">
          <span>● Έσοδα</span>
          <span>● Έξοδα</span>
        </div>
        <div className="flex items-end gap-2 sm:gap-[22px] h-[160px]">
          {financeMonths.map((m) => (
            <div key={m.month} className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <div className="flex items-end gap-[5px] h-[130px]">
                <div className="w-3 sm:w-4 rounded-t-md rounded-b-[3px] bg-primary" style={{ height: `${m.incomePct}%` }} />
                <div className="w-3 sm:w-4 rounded-t-md rounded-b-[3px] bg-primary" style={{ height: `${m.expensePct}%` }} />
              </div>
              <div className="text-xs text-[var(--muted)]">{m.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card overflow-hidden">
        <div className="font-heading font-bold text-base px-4 sm:px-6 pt-5 pb-1.5 text-[var(--text)]">Πρόσφατες συναλλαγές</div>
        {transactions.map((tx, i) => (
          <div key={i} className="flex justify-between items-center gap-3 px-4 sm:px-6 py-3.5 border-t border-[var(--line)]">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--text)] truncate">{tx.label}</div>
              <div className="text-xs text-[var(--muted)]">{tx.date}</div>
            </div>
            <div className={`shrink-0 text-[14.5px] font-bold ${tx.kind === 'income' ? 'text-primary-hover' : 'text-danger'}`}>
              {tx.amountLabel}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
