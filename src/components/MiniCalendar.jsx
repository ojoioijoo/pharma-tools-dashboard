export default function MiniCalendar({ calLabel, dayLabels, calCells, prevMonth, nextMonth, onSelect }) {
  return (
    <>
      <div className="flex justify-between items-center mb-2.5">
        <div
          onClick={prevMonth}
          className="cursor-pointer w-5 h-5 rounded-md flex items-center justify-center bg-[var(--input-bg)] text-[11px] font-bold text-[var(--text)]"
        >
          ‹
        </div>
        <div className="font-heading font-bold text-xs text-[var(--text)]">{calLabel}</div>
        <div
          onClick={nextMonth}
          className="cursor-pointer w-5 h-5 rounded-md flex items-center justify-center bg-[var(--input-bg)] text-[11px] font-bold text-[var(--text)]"
        >
          ›
        </div>
      </div>
      <div className="grid grid-cols-7 gap-[3px] mb-[3px]">
        {dayLabels.map((dl) => (
          <div key={dl} className="text-center text-[9px] font-semibold text-[var(--muted)]">
            {dl}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[3px]">
        {calCells.map((cell) =>
          cell.blank ? (
            <div key={cell.key} className="aspect-square" />
          ) : (
            <div
              key={cell.key}
              onClick={() => onSelect(cell.iso)}
              className={`aspect-square rounded-[5px] flex flex-col items-center justify-center cursor-pointer text-[9.5px] font-semibold relative ${
                cell.isSelected
                  ? 'bg-primary text-white'
                  : cell.isToday
                    ? 'bg-[var(--active-nav)] text-[var(--text)]'
                    : 'text-[var(--text)]'
              }`}
            >
              {cell.day}
              {cell.hasTasks && (
                <div className="w-[3px] h-[3px] rounded-full bg-primary absolute bottom-0.5" />
              )}
            </div>
          ),
        )}
      </div>
    </>
  );
}
