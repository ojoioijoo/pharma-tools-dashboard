import { useMemo } from 'react';
import { SunIcon, MoonIcon, SyncIcon, CheckIcon, WarningIcon } from './icons.jsx';

const SYNC_CONFIG = {
  syncing: { Icon: SyncIcon, label: 'Αποθήκευση...', className: 'animate-spin' },
  synced: { Icon: CheckIcon, label: 'Συγχρονισμένο', className: '' },
  error: { Icon: WarningIcon, label: 'Σφάλμα αποθήκευσης', className: '' },
};

function SyncBadge({ status }) {
  const config = SYNC_CONFIG[status];
  if (!config) return null;
  const { Icon, label, className } = config;
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--muted)]" title={label}>
      <Icon className={className} />
      <span className="hidden lg:inline">{label}</span>
    </div>
  );
}

export default function TopBar({ pageTitle, darkMode, toggleDarkMode, syncStatus }) {
  const dateLabel = useMemo(() => {
    const formatted = new Intl.DateTimeFormat('el-GR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, []);

  return (
    <div className="flex items-start justify-between mb-[30px]">
      <div>
        <div className="text-[13.5px] text-[var(--muted)] mb-1">Καλημέρα Στέφανε!</div>
        <div className="font-heading font-bold text-[27px] text-[var(--text)]">{pageTitle}</div>
      </div>
      <div className="flex items-center gap-3.5">
        <SyncBadge status={syncStatus} />
        <div className="bg-[var(--card-bg)] border border-[var(--line)] px-4 py-[9px] rounded-xl text-[13.5px] font-semibold text-[var(--text)]">
          {dateLabel}
        </div>
        <div
          onClick={toggleDarkMode}
          className="w-[38px] h-[38px] rounded-xl bg-[var(--card-bg)] border border-[var(--line)] flex items-center justify-center cursor-pointer text-[var(--text)]"
        >
          {darkMode ? <MoonIcon /> : <SunIcon />}
        </div>
        <div className="w-[38px] h-[38px] rounded-full bg-primary flex items-center justify-center font-heading font-bold text-sm text-[#1D2144]">
          ΕΠ
        </div>
      </div>
    </div>
  );
}
